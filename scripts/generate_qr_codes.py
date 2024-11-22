import os
import random
import string
import qrcode
from PIL import Image, ImageDraw, ImageFont
from firebase_admin import credentials, firestore, initialize_app
from tqdm import tqdm

# Initialize Firebase
cred = credentials.Certificate(
    'tcs-class-participation-firebase-adminsdk-jt6vy-ff864db22f.json')  # Path to your Firebase Admin SDK private key
initialize_app(cred)
db = firestore.client()


# Function to generate random string for QR code IDs
def generate_random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


from PIL import ImageFont, ImageDraw, Image
import qrcode
import os


from PIL import ImageFont, ImageDraw, Image

def create_qr_code(amount, qr_code_id, folder, dimension=300, logo_path=None):
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction for logo placement
        box_size=10,
        border=4,
    )
    qr.add_data(qr_code_id)
    qr.make(fit=True)

    # Create QR code image
    qr_image = qr.make_image(fill='black', back_color='white').convert('RGB')
    qr_image = qr_image.resize((dimension, dimension))  # Resize to specified dimensions

    # Embed logo in the center of the QR code
    if logo_path:
        logo = Image.open(logo_path)
        logo_size = dimension // 4  # Logo should take about 1/4 of the QR code dimension
        logo = logo.resize((logo_size, logo_size), Image.ANTIALIAS)

        # Calculate position for the logo
        logo_position = (
            (qr_image.size[0] - logo_size) // 2,
            (qr_image.size[1] - logo_size) // 2,
        )

        # Paste the logo onto the QR code
        qr_image.paste(logo, logo_position, mask=logo)

    # Create a new image to add text below the QR code
    canvas_width = dimension
    canvas_height = dimension + 50  # Extra height for text
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')

    # Paste QR code onto the canvas
    canvas.paste(qr_image, (0, 0))

    # Add text (e.g., "50 Hello-Kitties") below the QR code
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()  # Default font
    text = f"{amount} Hello-Kitties"

    # Center the text
    text_bbox = draw.textbbox((0, 0), text, font=font)  # Get text bounding box
    text_width = text_bbox[2] - text_bbox[0]
    text_position = ((canvas_width - text_width) // 2, dimension + 10)
    draw.text(text_position, text, fill='black', font=font)

    # Save the final image
    img_path = os.path.join(folder, f'{qr_code_id}.png')
    canvas.save(img_path)


# Function to add QR codes to Firestore and generate images
def add_qr_codes_to_firestore_and_generate(amount_counts, qr_dimension):
    # Create a folder named 'qrcodes' if it doesn't exist
    if not os.path.exists('qrcodes'):
        os.makedirs('qrcodes')

    # Process each amount and generate the corresponding QR codes
    for amount, count in amount_counts.items():
        if count > 0:
            # Create a subfolder for the amount if it doesn't exist
            folder = f'qrcodes/{amount}'
            if not os.path.exists(folder):
                os.makedirs(folder)

            print(f'Generating {count} QR codes for value {amount}...')
            for _ in tqdm(range(count), desc=f'Creating {amount} QR codes', ncols=100):
                qr_code_id = generate_random_string(12)  # Generate random QR code ID

                # Save the QR code to Firestore
                doc_ref = db.collection('qr_codes').document(qr_code_id)
                doc_ref.set({
                    'amount': amount,
                    'qrCodeId': qr_code_id
                })

                # Create and save the QR code image
                create_qr_code(amount, qr_code_id, folder, qr_dimension)

            print(f'{count} QR codes for value {amount} generated and saved in {folder}.')


# Ask the user how many QR codes to generate and QR dimensions
def main():
    print("How many QR codes would you like to generate?")
    try:
        qr_50 = int(input("Number of 50 value QR codes: "))
        qr_30 = int(input("Number of 30 value QR codes: "))
        qr_20 = int(input("Number of 20 value QR codes: "))
        qr_dimension = int(input("Enter the dimension of QR codes (e.g., 300 for 300x300): "))

        # Dictionary to hold amounts and their counts
        amount_counts = {
            50: qr_50,
            30: qr_30,
            20: qr_20
        }

        add_qr_codes_to_firestore_and_generate(amount_counts, qr_dimension)
    except ValueError:
        print("Please enter valid integer numbers.")
        return


if __name__ == "__main__":
    main()
