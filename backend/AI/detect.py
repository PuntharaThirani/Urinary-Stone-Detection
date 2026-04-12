import sys
import os
import json
import base64
import cv2
from ultralytics import YOLO

# -------------------------------
# Paths and Config
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "AI_Models", "best.pt")

CONF_THRESHOLD = 0.6
IOU_THRESHOLD = 0.4
IMG_SIZE = 1024
MAX_DET = 3
MIN_BOX_AREA = 500

# -------------------------------
# Load Model Once
# -------------------------------
if os.path.exists(MODEL_PATH):
    MODEL = YOLO(MODEL_PATH)
else:
    MODEL = None


# -------------------------------
# CLAHE Enhancement
# -------------------------------
def apply_clahe(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_img = clahe.apply(gray)
    return cv2.cvtColor(enhanced_img, cv2.COLOR_GRAY2BGR)


# -------------------------------
# Encode image to base64
# -------------------------------
def image_to_base64(img):
    success, buffer = cv2.imencode(".jpg", img)
    if not success:
        return None
    return base64.b64encode(buffer).decode("utf-8")


# -------------------------------
# Main Analysis Function
# -------------------------------
def analyze_xray(image_path):
    try:
        # 1. Validate image path
        if not image_path or not os.path.exists(image_path):
            print(json.dumps({
                "status": "error",
                "message": "Image path is invalid or file does not exist"
            }))
            return

        # 2. Validate model
        if MODEL is None:
            print(json.dumps({
                "status": "error",
                "message": "Model file not found"
            }))
            return

        # 3. Ensure single-class model
        if len(MODEL.names) != 1:
            print(json.dumps({
                "status": "error",
                "message": "Loaded model is not single-class. Please use the correct best.pt"
            }))
            return

        # 4. Read image
        original_img = cv2.imread(image_path)
        if original_img is None:
            print(json.dumps({
                "status": "error",
                "message": "Failed to read image"
            }))
            return

        # 5. Enhance image
        enhanced_img = apply_clahe(original_img)

        # 6. Run prediction
        results = MODEL.predict(
            source=enhanced_img,
            conf=CONF_THRESHOLD,
            iou=IOU_THRESHOLD,
            imgsz=IMG_SIZE,
            device="cpu",
            max_det=MAX_DET,
            verbose=False
        )

        result = results[0]
        detections = []
        valid_boxes = []

        # 7. Filter detections
        for idx, box in enumerate(result.boxes):
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = map(float, [x1, y1, x2, y2])

            width = x2 - x1
            height = y2 - y1
            area = width * height
            confidence = float(box.conf[0])

            if area >= MIN_BOX_AREA:
                valid_boxes.append(box)
                detections.append({
                    "id": idx + 1,
                    "class": "stone",
                    "confidence": round(confidence, 3),
                    "bbox": {
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2),
                        "width": round(width, 2),
                        "height": round(height, 2),
                        "area": round(area, 2)
                    }
                })

        stone_count = len(valid_boxes)

        # 8. Draw annotated output
        annotated_img = original_img.copy()
        for detection in detections:
            x1 = int(detection["bbox"]["x1"])
            y1 = int(detection["bbox"]["y1"])
            x2 = int(detection["bbox"]["x2"])
            y2 = int(detection["bbox"]["y2"])
            conf = detection["confidence"]

            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                annotated_img,
                f"Stone {conf:.2f}",
                (x1, max(y1 - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2
            )

        annotated_base64 = image_to_base64(annotated_img)

        # 9. Final output
        output = {
            "status": "success",
            "stoneCount": stone_count,
            "hasStones": stone_count > 0,
            "details": detections,
            "annotatedImage": annotated_base64
        }

        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))


# -------------------------------
# Entry Point
# -------------------------------
if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_xray(sys.argv[1])
    else:
        print(json.dumps({
            "status": "error",
            "message": "No image path provided"
        }))