import qrcode
import os
import sys
import json

def generate_student_qr(user_data):
    """
    Generates a QR code image for a student/user and saves it to qrs_folder.
    Expects user_data to have: Name, Group, Institute, Year, Profession
    """
    # The folder where the QR code will be saved
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_folder = os.path.join(script_dir, "uploads", "card_id")
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # File name for the output image
    safe_name = user_data['Name'].replace(' ', '_').upper()
    filename = f"QR_{safe_name}.png"
    output_path = os.path.join(output_folder, filename)

    # --- Generate QR Code Content ---
    # Format matches the scanner: NAME:xxx|GROUP:yyy|...
    qr_content = f"NAME:{user_data['Name']}|GROUP:{user_data['Group']}|INSTITUTE:{user_data['Institute']}|YEAR:{user_data['Year']}|PROFESSION:{user_data['Profession']}"

    # Create QR Code object
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=2,
    )
    qr.add_data(qr_content)
    qr.make(fit=True)

    # Generate simple QR Image
    qr_img = qr.make_image(fill_color="black", back_color="white")

    # Save the QR
    qr_img.save(output_path)
    # Print the absolute path for the node server to capture
    print(output_path)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Expecting JSON string as argument
        try:
            input_data = json.loads(sys.argv[1])
            generate_student_qr(input_data)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)
    else:
        # Default test data
        test_data = {
            "Name": "Saif Befaquir",
            "Group": "DEV101",
            "Institute": "OFPPT ISTA Mirleft",
            "Year": "2025/2026",
            "Profession": "stagiaire"
        }
        generate_student_qr(test_data)
