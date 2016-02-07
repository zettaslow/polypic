/**
 * Created by btsmith on 2/6/2016.
 */

function loadScreen()
{
    var c = document.getElementById("modifyCanvas");
    var context = c.getContext("2d");
    var image = new Image();
    image.src = 'images/justDOOit.png';
    context.drawImage(image, 0, 0);
}

function replaceImage()
{
    //Grab color value of top left pixel to use as chroma key. Kinda janky.
    var canvas = document.getElementById("modifyCanvas");
    var context = canvas.getContext("2d");
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var start = {
        red: data[0],
        green: data[1],
        blue: data[2]
    };

    //iterate over all pixels to replace chroma key value
    var tolerance = 200; //I only have a vague idea what this does.
    for(var i = 0, n = data.length; i < n; i += 4){
        //calculate the difference of current pixel's color value from chroma key value
        var diff = Math.abs(data[i] - data[0]) + Math.abs(data[i+1] - data[1])
            + Math.abs(data[i+2] - data[2]);
        if(diff < tolerance)
        {
            //If pixel is within tolerance level, reduce it's alpha channel to 0
            data[i+3] = (diff*diff)/tolerance;
        }
    }

    var bgImage = new Image();
    bgImage.src = "images/reverse-ree.png";
    var bgImageData = makeBGImage(bgImage);

    context.putImageData(imageData,0,0);
    //context.putImageData(bgImageData,0,0);
    //var ourCanvas = document.getElementById("modifyCanvas");
    //ourCanvas.style.background='#ABC123';
}

//returns an imageData for the background Image
function makeBGImage(image)
{
    var invisibleCanvas = document.createElement('canvas');
    invisibleCanvas.setAttribute("width", "640");
    invisibleCanvas.setAttribute("height", "480");

    var context = invisibleCanvas.getContext('2d');
    return context.getImageData(0,0, invisibleCanvas.width, invisibleCanvas.height);
}