import sys
import os
import json
import base64
import cv2
import numpy as np
from ultralytics import YOLO

# -------------------------------
# CLAHE Enhancement (Safer Version)
# -------------------------------
def apply_clahe(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_img = clahe.apply(gray)
    return cv2.cvtColor(enhanced_img, cv2.COLOR_GRAY2BGR)

# -------------------------------
# Main Analysis Function
# -------------------------------
def analyze_xray(image_path):
    try:
        # 1️⃣ Check Image Path
        if not os.path.exists(image_path):
            print(json.dumps({"status": "error", "message": "Image path invalid"}))
            return

        # 2️⃣ Load Model
        model_path = os.path.join("AI_Models", "best.pt")
        if not os.path.exists(model_path):
            print(json.dumps({"status": "error", "message": "Model file not found"}))
            return

        yolo_model = YOLO(model_path)

        # 🔎 Ensure Single Class Model
        if len(yolo_model.names) != 1:
            print(json.dumps({
                "status": "error",
                "message": "Model is not single-class. Please load correct best.pt"
            }))
            return

        # 3️⃣ Read Image
        original_img = cv2.imread(image_path)
        if original_img is None:
            print(json.dumps({"status": "error", "message": "Failed to read image"}))
            return

        enhanced_img = apply_clahe(original_img)

        # 4️⃣ Predict (Medical Safe Settings)
        results = yolo_model.predict(
            source=enhanced_img,
            conf=0.6,          # 🔥 Higher confidence
            iou=0.4,
            imgsz=1024,
            device="cpu",
            max_det=3,         # Avoid too many detections
            verbose=False
        )

        r = results[0]

        details = []
        valid_boxes = []

        # 5️⃣ Filter Tiny Noise Detections
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            width = float(x2 - x1)
            height = float(y2 - y1)
            area = width * height

            if area > 500:   # 🔥 Noise filter threshold (adjust if needed)
                valid_boxes.append(box)
                details.append({
                    "class": "stone",
                    "confidence": round(float(box.conf[0]), 3)
                })

        total_stone_count = len(valid_boxes)

        # 6️⃣ Draw Only Valid Boxes
        annotated_img = original_img.copy()
        for box in valid_boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])

            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                annotated_img,
                f"Stone {conf:.2f}",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2
            )

        # 7️⃣ Convert to Base64
        _, buffer = cv2.imencode('.jpg', annotated_img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        # 8️⃣ Final Output
        output = {
            "status": "success",
            "stoneCount": total_stone_count,
            "details": details,
            "annotatedImage": img_base64
        }

        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))


# -------------------------------
# Entry Point
# -------------------------------
if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_xray(sys.argv[1])
    else:
        print(json.dumps({"status": "error", "message": "No image path provided"}))