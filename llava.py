import requests
import time
import json
import sys
import ollama

def analyze_image(image_base64, custom_prompt):

    response = ollama.generate(model='llava', prompt=custom_prompt, images=[image_base64])

    try:

        full_response = response['response']

        return full_response
    except Exception as e:
        return f"Error: {e}"

def run_analysis(index, image_base64):
    if index == 0:
        custom_prompt = "The following image is a graph representing data. It shows the energy level (y-axis) over then span of the number of reporductive cycles, that goes from 0 to 100, (x-axis) of male song birds. This corresponds an energy function. The true nature of the energy function is to map the additional energy that is gained by the songbird when successfully retriving food minus the cost of investing in 3 hormonally-mediated traits. These traits correspond to Gamete Maturation, Parental Effort, and Mating Effort respectively. In the graph, there may or may not be a food shortage that corresponds with a decrease in energy, since the amount of food retreived is lessened. If there is a dip in the graph, there is a food shortage. A reproductive cycle is measured in time of t, where t can be an arbitrary time, however we assume that all reproductive cycles in the model last for a time of t. There is a legend at the top of the graph, with only one curve modeling the energy level. They both correspond to the color light blue. There are also no units for the y axis. If there is a sudden drop in the graph (y value reaches 0 in one cycle), that means that the bird perished. If the graph does show a sudden drop the bird is still alive. What could the graph mean? Explain your answer in 2 or 3 sentences. Be concise. Assume you have enough context to make a speculation."
    elif index == 1:
        custom_prompt = "The following image is a graph representing data. It shows the sensitivities of three tissues (y-axis) over then span of the number of reporductive cycles, that goes from 0 to 100, (x-axis) of male song birds. There are three curves (that each correspond to a tissue) relate to three hormonally mediated traits. These traits correspond to Gamete Maturation, Parental Effort, and Mating Effort respectively. There is a value named S_i_max that, theoretically, make it so that maximum rate of change of a sensitivity at a target tissue is different. However, for the purposes of the model right now, S_i_max is the same across all tissues. There is a energy function. The true nature of the energy function is to map the additional energy that is gained by the songbird when successfully retriving food minus the cost of investing in 3 hormonally-mediated traits. These traits correspond to Gamete Maturation, Parental Effort, and Mating Effort respectively. In the graph, there may or may not be a food shortage that also corresponds with a decrease in energy, since the amount of food retreived is lessened. If there is a dip in the graph, there is a food shortage. The hormone production requires energy, and since energy decreases, there is less hormone being produced. Therefore, the bird does adjusts its sensitivity at the target because less hormone is being produced. So, there may be a dip in the chart showing the lower sensitivity. A reproductive cycle is measured in time of t, where t can be an arbitrary time, however we assume that all reproductive cycles in the model last for a time of t. There is a legend at the top of the graph, with three items corresponding to each curve. The curves and the legend are related by color. There are also no units for the y axis. If there is a sudden drop in the graph, that means that the bird perished. What could the graph mean? Explain your answer in 2 or 3 sentences. Be concise. Assume you have enough context to make a speculation."
    elif index == 2:
        custom_prompt = "The following image is a graph representing data. It shows the production of hormone over the span of the number of reporductive cycles, that goes from 0 to 100, (x-axis) of male song birds. This corresponds to hormone molecules (Hormone Production) that bind to hormone receptors (Hormone Sensitivity). The production of hormones affect 3 hormonally-mediated traits. These traits correspond to Gamete Maturation, Parental Effort, and Mating Effort respectively. In the graph, there may or may not be a food shortage that corresponds with a decrease in energy, since the amount of food retreived is lessened. Because there is less energy, less hormone gets produced. If there is a dip in the graph, there is a food shortage. A reproductive cycle is measured in time of t, where t can be an arbitrary time, however we assume that all reproductive cycles in the model last for a time of t. There is a legend at the top of the graph, with only one curve modeling the energy level. They both correspond to the color light blue. There are also no units for the y axis. If there is a sudden drop in the graph (y value reaches 0 in one cycle), that means that the bird perished. If the graph does show a sudden drop the bird is still alive. What could the graph mean? Explain your answer in 2 or 3 sentences. Be concise. Assume you have enough context to make a speculation."
    elif index == 3:
        custom_prompt = "The following image is a graph representing data. It shows the fitness gained at each reproductive cycle over the span of the number of reporductive cycles, that goes from 0 to 100, (x-axis) of male song birds. This corressponds to a fitness function. The true nature of the fitness function is the a random Beta variable times the value of 3 hormonally-mediated traits. The traits have a z as an exponent that determine their weights in the fitness function. These traits correspond to Gamete Maturation, Parental Effort, and Mating Effort respectively. A reproductive cycle is measured in time of t, where t can be an arbitrary time, however we assume that all reproductive cycles in the model last for a time of t. There is a legend at the top of the graph, with only one curve modeling the energy level. They both correspond to the color light blue. There are also no units for the y axis. If there is a sudden drop in the graph (y value reaches 0 in one cycle), that means that the bird perished. If the graph does show a sudden drop the bird is still alive. What could the graph mean? Explain your answer in 2 or 3 sentences. Be concise. Assume you have enough context to make a speculation."
    elif index == 4:
        custom_prompt = "The following image is a graph representing data. It shows the cumulative fitness gained by a song male bird  over the span of the number of reporductive cycles, that goes from 0 to 100, (x-axis). This corressponds to a fitness function. The true nature of the fitness function is the a random Beta variable times the value of 3 hormonally-mediated traits. The traits have a z as an exponent that determine their weights in the fitness function. There is a fitness value produced at each time step, and it is added by the cumulative fitness of the previous time step. These traits correspond to Gamete Maturation, Parental Effort, and Mating Effort respectively. A reproductive cycle is measured in time of t, where t can be an arbitrary time, however we assume that all reproductive cycles in the model last for a time of t. There is a legend at the top of the graph, with only one curve modeling the energy level. They both correspond to the color light blue. There are also no units for the y axis. If there is a sudden drop in the graph (y value reaches 0 in one cycle), that means that the bird perished. If the graph does show a sudden drop the bird is still alive. What could the graph mean? Explain your answer in 2 or 3 sentences. Be concise. Assume you have enough context to make a speculation."
    else:
        print("there has been an error")
        



    result = analyze_image(image_base64, custom_prompt)
    
    return result

if __name__ == "__main__":
    # Example of how to call run_analysis with hardcoded values or from another script
    base64_image = ["INSERT HARDCODED VALUE"]
    index = 0
    #custom_prompt = "The following image is a graph representing data. Or at least its supposed to be. is this pizza? is it a graph? What about the x and y axes if there are any? Is it just a background with a gray color?"
    run_analysis(index, base64_image)
