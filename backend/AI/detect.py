import sys
import os
import json
import base64
import cv2
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from ultralytics import YOLO

# -------------------------------
# Paths
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DETECTION_MODEL_PATH = os.path.join(BASE_DIR, "..", "AI_Models", "Detection.pt")
CLASSIFIER_MODEL_PATH = os.path.join(BASE_DIR, "..", "AI_Models", "efficientnet_b0_kidney_stone.pth")

# -------------------------------
# Config
# -------------------------------
CONF_THRESHOLD = 0.25
IOU_THRESHOLD = 0.7
IMG_SIZE = 1280
MIN_BOX_AREA = 50   # 🔥 small stones detect karanna

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -------------------------------
# Load YOLO Model
# -------------------------------
YOLO_MODEL = YOLO(DETECTION_MODEL_PATH) if os.path.exists(DETECTION_MODEL_PATH) else None

# -------------------------------
# Load Classifier (OPTIONAL)
# -------------------------------
CLASSIFIER_MODEL = None
CLASS_NAMES = ["normal", "stone"]

if os.path.exists(CLASSIFIER_MODEL_PATH):
    model_tmp = models.efficientnet_b0(weights=None)
    num_features = model_tmp.classifier[1].in_features
    model_tmp.classifier[1] = nn.Linear(num_features, 2)

    model_tmp.load_state_dict(torch.load(CLASSIFIER_MODEL_PATH, map_location=device))
    model_tmp.eval()
    model_tmp.to(device)

    CLASSIFIER_MODEL = model_tmp

# -------------------------------
# Transform
# -------------------------------
classifier_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# -------------------------------
# CLAHE
# -------------------------------
def apply_clahe(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    return cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)

# -------------------------------
# Base64 Encode
# -------------------------------
def image_to_base64(img):
    success, buffer = cv2.imencode(".jpg", img)
    return base64.b64encode(buffer).decode("utf-8") if success else None

# -------------------------------
# Classification (optional)
# -------------------------------
def classify_xray(image_path):
    if CLASSIFIER_MODEL is None:
        return None, None

    img = Image.open(image_path).convert("RGB")
    tensor = classifier_transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = CLASSIFIER_MODEL(tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        pred = torch.argmax(probs).item()
        confidence = float(probs[pred])

    return CLASS_NAMES[pred], round(confidence * 100, 2)

# -------------------------------
# Main Function
# -------------------------------
def analyze_xray(image_path):
    try:
        if not image_path or not os.path.exists(image_path):
            print(json.dumps({"status": "error", "message": "Invalid image path"}))
            return

        if YOLO_MODEL is None:
            print(json.dumps({"status": "error", "message": "Detection model not found"}))
            return

        # Read image
        original_img = cv2.imread(image_path)
        if original_img is None:
            print(json.dumps({"status": "error", "message": "Failed to read image"}))
            return

        # Optional classification (INFO ONLY)
        predicted_class, class_confidence = classify_xray(image_path)

        # 🔥 ALWAYS run detection
        enhanced_img = apply_clahe(original_img)

        results = YOLO_MODEL.predict(
            source=enhanced_img,
            conf=CONF_THRESHOLD,
            iou=IOU_THRESHOLD,
            imgsz=IMG_SIZE,
            device=0 if torch.cuda.is_available() else "cpu",
            verbose=False
        )

        result = results[0]
        detections = []

        for idx, box in enumerate(result.boxes):
            x1, y1, x2, y2 = map(float, box.xyxy[0])
            width = x2 - x1
            height = y2 - y1
            area = width * height
            confidence = float(box.conf[0])

            if area >= MIN_BOX_AREA:
                detections.append({
                    "id": idx + 1,
                    "confidence": round(confidence, 3),
                    "bbox": {
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2)
                    }
                })

        # Draw boxes
        annotated_img = original_img.copy()

        for d in detections:
            x1 = int(d["bbox"]["x1"])
            y1 = int(d["bbox"]["y1"])
            x2 = int(d["bbox"]["x2"])
            y2 = int(d["bbox"]["y2"])

            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(annotated_img, f"{d['confidence']:.2f}",
                        (x1, max(y1 - 10, 20)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        # Final decision (ONLY YOLO)
        has_stones = len(detections) > 0

        print(json.dumps({
            "status": "success",
            "phase1": {
                "result": predicted_class,
                "confidence": class_confidence
            },
            "hasStones": has_stones,
            "stoneCount": len(detections),
            "details": detections,
            "annotatedImage": image_to_base64(annotated_img)
        }))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

# -------------------------------
# Entry
# -------------------------------
if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_xray(sys.argv[1])
    else:
        print(json.dumps({"status": "error", "message": "No image path provided"}))