import requests
import time
import json
import sys

def analyze_image(image_base64, custom_prompt):
    url = "http://localhost:11434/api/generate"
    headers = {"Content-Type": "application/json"}

    payload = {
        "model": "llava",
        "prompt": custom_prompt,
        "images": [image_base64]
    }

    response = requests.post(url, headers=headers, json=payload)

    try:
        # Split the response text into separate lines
        response_lines = response.text.strip().split('\n')

        # Extract and concatenate the 'response' part from each line
        full_response = ''.join(json.loads(line)['response'] for line in response_lines if 'response' in json.loads(line))

        return full_response
    except Exception as e:
        return f"Error: {e}"

def run_analysis(image_base64):
    custom_prompt = "The following image is a graph representing data. Or at least its supposed to be. is this pizza? is it a graph? What about the x and y axes if there are any? Is it just a background with a gray color?"
    result = analyze_image(image_base64, custom_prompt)
    #print("Response:", result)
    return result

if __name__ == "__main__":
    # Example of how to call run_analysis with hardcoded values or from another script
    base64_image = "INSERT HARDCODED VALUE"
    custom_prompt = "The following image is a graph representing data. Or at least its supposed to be. is this pizza? is it a graph? What about the x and y axes if there are any? Is it just a background with a gray color?"
    run_analysis(base64_image[22:], custom_prompt)
