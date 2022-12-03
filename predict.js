
//Triggering change event after the Image is selected from the Browse Button 
$("#image-selector").change(function(){
    
    //Defining the filereader()
    let reader = new FileReader();
    
    //Initialization on Load of the Window.
    reader.onload = function(){
        let dataURL = reader.result;
        $("#selected-image").attr("src",dataURL);
        $("#prediction-list").empty();
    }
    
    let file = $("#image-selector").prop('files')[0];
    
    //reading the file from file object
    reader.readAsDataURL(file);
});

//defining the model
let model;

//define a async function under which Model Load up and Progress bar is controlled
(async function(){
    model = await tf.loadGraphModel("ht3_model_js/model.json");
    $('.progress-bar').hide();
})();

//defining the Click event.
$("#predict-button").click(async function(){
    
    //Initialize the image object
    let image= $('#selected-image').get(0);
    
    //convert the image object to a tensor by resizing it and Normalizing it using the ImageNet mean RGB values
    let tensor = tf.browser.fromPixels(image)
                    .resizeNearestNeighbor([100,100])
					.mean(2)
                    .toFloat()
					.expandDims(0)
					.expandDims(-1).div(tf.scalar(255));
            
//define the Prediction object and put a future event for prediction.
let prediction = await model.predict(tensor).data();
var pred_str = (prediction > 0.5) ? "Perro" : "Gato";
var pred_prob = (prediction > 0.5) ? prediction : 1-prediction;

//manupulating the DOM using Jquery
$("#prediction-list").empty();
$("#prediction-list").html(`${pred_str} con probabilidad de ${pred_prob}`);

});
