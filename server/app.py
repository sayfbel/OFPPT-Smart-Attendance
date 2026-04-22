import cv2
import os
import datetime
import time

import sys

try:
    from pygrabber.dshow_graph import FilterGraph
except ImportError:
    FilterGraph = None

# --- Configuration ---
QR_FOLDER = "./uploads/card_id"
CAMERA_INDEX = 1  # Standard fallback index (Webcam)
# IF USING DROIDCAM IP APP, PASTE URL HERE (e.g., "http://192.168.1.15:4747/video")
DROIDCAM_URL = "" 

def auto_detect_droidcam(fallback_index):
    # Priority 1: Direct IP URL
    if DROIDCAM_URL:
        print(f"--> USING DROIDCAM IP STREAM: {DROIDCAM_URL}")
        return DROIDCAM_URL

    if FilterGraph is None:
        return fallback_index
    
    try:
        graph = FilterGraph()
        devices = graph.get_input_devices()
        print(f"--- DETECTING OPTIC HARDWARE ({len(devices)} nodes found) ---")
        for i, name in enumerate(devices):
            print(f"Node {i}: {name}")
            if "droidcam" in name.lower():
                print(f"--> LOCKING DROIDCAM CLIENT ON NODE {i}")
                return i
    except Exception as e:
        print(f"Registry access failed: {e}")
    
    return fallback_index

# --- Filter Settings ---
ENV_INDEX = int(sys.argv[2]) if len(sys.argv) > 2 else 0
CAMERA_INDEX = auto_detect_droidcam(ENV_INDEX)
GROUP_FILTER = sys.argv[1] if len(sys.argv) > 1 else "DEV101"
# Check if CAMERA_INDEX is a string (URL)
IS_IP_CAM = isinstance(CAMERA_INDEX, str)


def parse_qr_data(content):
    """Dynamically extract NAME and GROUP from QR signal."""
    try:
        parts = content.split("|")
        name = [p.split(":")[1] for p in parts if p.startswith("NAME:")][0]
        group = [p.split(":")[1] for p in parts if p.startswith("GROUP:")][0]
        return name, group
    except Exception:
        return None, None

# Initialize Session
print(f"--- INITIALIZING CAMERA FEED (TARGET_INDEX: {CAMERA_INDEX}) ---")
cap = cv2.VideoCapture(CAMERA_INDEX)

if not cap.isOpened():
    print("Default backend failed, attempting DirectShow protocol...")
    cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("CRITICAL: Optical sensors could not be bridged. Check hardware connection.")
    sys.exit(1)

detector = cv2.QRCodeDetector()
scanned_set = {} # store name and time
SCAN_COOLDOWN = 3 # seconds

def print_scan(name, status="present"):
    """Prints scan result to console for system bridge."""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[SCAN] {timestamp}")
    print(f"NAME: {name} : {status}")
    print("-" * 30)
    sys.stdout.flush() # Ensure bridge receives data immediately

print(f">>> Scanner Active (Filtering for Group: {GROUP_FILTER}).")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Camera access lost.")
        break
    
    qr_content, points, _ = detector.detectAndDecode(frame)
    if qr_content:
        name, group = parse_qr_data(qr_content)
        
        if name and group:
            current_time = time.time()
            if name not in scanned_set or (current_time - scanned_set[name] > SCAN_COOLDOWN):
                scanned_set[name] = current_time

                if group == GROUP_FILTER:
                    print_scan(name, "present")
                    cv2.putText(frame, f"PRESENT: {name}", (50, 50), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                else:
                    print(f"ALERT: {name} is in Group {group}, not {GROUP_FILTER}")
                    cv2.putText(frame, "ACCESS DENIED: WRONG GROUP", (50, 50), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
        else:
            cv2.putText(frame, "INVALID SIGNAL FORMAT", (50, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

    cv2.imshow("OFPPT Attendance Scanner", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
