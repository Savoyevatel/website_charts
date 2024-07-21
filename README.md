# Food Ecommerce Platform with Chatbot Integration
***
This repository contains the code for a food restaurant ecommerce platform developed using React for the frontend and Django for the backend. The project includes a Dialogflow chatbot for seamless customer 
support and automated order processing.

***

## Project Description
**_NOTE:_** This project is a full-stack ecommerce platform designed for a food restaurant. It allows users to browse and purchase food items online, with a user-friendly interface powered by React. 
The backend, built with Django, handles all the server-side operations, including order processing and data management. Additionally, a Dialogflow chatbot is integrated to provide customers with instant support and to automate the order process.

### Features
* User Authentication: Secure login and registration using Django's authentication system.
* Product Catalog: Display of food items with detailed descriptions, prices, and images.
* Shopping Cart: Functionality for adding, removing, and updating items in the cart.
* Order Management: Automated order processing and real-time order status updates.
* Chatbot Integration: A Dialogflow chatbot for customer support and automated order processing.

#### Verify installation
* Before you install, verify your Python and MATLAB configurations.
* Check that your system has a supported version of Python and MATLAB R2014b or later. Version R2021b was used in our case.
This version supports Python 3.7, 3.8 and 3.9.
* Next, find the path to the MATLAB folder. Start MATLAB and type `matlabroot` in the command window. Copy the path returned
by `matlabroot`.

#### Windows
Open a command prompt and type the following commands:
```
cd "MATLABROOT\extern\engines\python"
python3 setup.py install
```

### Matlab Dependencies
* Image Processing Toolbox
* MATLAB Support for MinGW-w64 C/C++ Compiler
* MATLAB Compiler
* MATLAB Compiler SDK

### Python Package dependencies
The python package dependencies can be found in [dss_recognition/requirements.txt](dss_recognition/requirements.txt)

### Running the pipeline
To run the full pipeline for the line segmentation, character segmentation and character recognition, first ensure the
dataset is using the correct naming scheme. This means all binarized versions of files contain 'binarized' in the filename.
For example, a file can be named: `P123-Fg001-R-C01-R01-binarized.jpg`

For the pipeline to take the data, either deposite all image files in the `image-data` folder in the `dss_recognition` directory,
or specify the location as a command line argument. By default, the resulting text files of the model are saved to a `results` directory in the `dss_recognition` directory.
However, if the user prefers, a custom saving directory can also be used by specifying this in the command line as well. `--line_segment_method` is a flag to specify which line segmenter to use, it can either be the blob-line method ('blob') or horizontal histogram projection ('hhp').

Running the pipeline is done by running the following file from the `dss_recognition` directory:

```
python3 dss_recognizer.py --dir_images <path_to_dir> --dir_save_predictions <path_to_dir> --line_segment_method <method>
```

## IAM Dataset
### Code Inspiration
Some code inspired from [https://github.com/GitYCC/crnn-pytorch](https://github.com/GitYCC/crnn-pytorch) and [https://github.com/kris314/deep-text-recognition-benchmark](https://github.com/kris314/deep-text-recognition-benchmark)

### Setup
The python package dependencies can be found in [iam_line_recognition/requirements.txt](iam_line_recognition/requirements.txt)

### To train the model
* To train the model run the following
```
python3 train.py
```
* To list all the commandline arguments, run the following
```
python3 train.py --help
```

### Running the final trained model to generate predictions
* The script [line_recognition/final_iam_line_recognizer.py](line_recognition/final_iam_line_recognizer.py) can be run in the following way. Use `--which_hw_model` option to specify the model to be used. To run CRNN use `--which_hw_model crnn` and to run STN-CRNN use `--which_hw_model stn_crnn`
* The predictions of the model will be saved in individual .txt files i.e. one for each image, in a directory named `results_crnn` with CRNN model and `results_stn_crnn` with STN-CRNN model
```
python3 final_iam_line_recognizer.py --dir_images <full_path_to_dir> --which_hw_model <hw_model> --file_model <full_path_to_model_file>
```

## References
<a id="1">[1]</a>
Ptak, R., Zygadlo, B., Unold, O. (2017). Projection-Based Text Line Segmentation with a Variable
Threshold.
International Journal of Applied Mathematics and Computer Science, 27, doi:10.1515/amcs-2017-0014.
[paper link](https://www.researchgate.net/publication/315887219_Projection-Based_Text_Line_Segmentation_with_a_Variable_Threshold/fulltext/5909a119aca272f658fc7c62/Projection-Based-Text-Line-Segmentation-with-a-Variable-Threshold.pdf)

<a id="2">[2]</a>
Berat Kurar, B., Cohen, R., Droby, A., Rabaev, I. & El-Sana, J. (2020). Learning-Free Text Line Segmentation for Historical
Handwritten Documents.
Applied Sciences, 10, 8276; doi:10.3390/app10228276.
[paper link](https://www.researchgate.net/profile/Berat-Barakat/publication/347109911_Learning-Free_Text_Line_Segmentation_for_Historical_Handwritten_Documents/links/6005e26a45851553a053b11c/Learning-Free-Text-Line-Segmentation-for-Historical-Handwritten-Documents.pdf)

<a id="3">[3]</a>
Dutta, Kartik & Krishnan, Praveen & Mathew, Minesh & Jawahar, C.V.. (2018). Improving CNN-RNN Hybrid Networks for Handwriting Recognition.
80-85, doi:10.1109/ICFHR-2018.2018.00023.
[paper link](http://cdn.iiit.ac.in/cdn/cvit.iiit.ac.in/images/ConferencePapers/2018/improving-cnn-rnn.pdf)
