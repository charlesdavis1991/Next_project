function makesvg(percentage, inner_text=""){

  var abs_percentage = Math.abs(percentage).toString();
  var percentage_str = percentage.toString();
  var classes = ""

  if(percentage < 0){
    classes = "danger-stroke circle-chart__circle--negative";
  }
  else if(percentage > 0 && percentage < 5){
    classes = "stroke-light-gray";
  }
  else if(percentage > 5 && percentage < 10){
    classes = "stroke-light-blue";
  }
  else if(percentage > 10 && percentage < 15){
    classes = "stroke-sky-blue";
  }
  else if(percentage > 15 && percentage <= 20){
    classes = "stroke-blue-jeans";
  }
  else if(percentage > 20 && percentage <= 25){
    classes = "stroke-vivid-cerulean";
  }
  else if(percentage > 25 && percentage <= 30){
    classes = "stroke-button-blue";
  }
  else if(percentage > 30 && percentage <= 35){
    classes = "stroke-blueberry";
  }
  else if(percentage > 35 && percentage <= 40){
    classes = "stroke-dark-blueberry";
  }
  else if(percentage > 40 && percentage <= 45){
    classes = "stroke-violet";
  }
  else if(percentage > 45 && percentage <= 50){
    classes = "stroke-amethyst";
  }
  else if(percentage > 50 && percentage <= 55){
    classes = "stroke-rosepink";
  }
  else if(percentage > 55 && percentage <= 60){
    classes = "stroke-mulberry";
  }
  else if(percentage > 60 && percentage <= 65){
    classes = "stroke-carmin-pink";
  }
  else if(percentage > 65 && percentage <= 70){
    classes = "stroke-orange-soda";
  }
  else if(percentage > 70 && percentage <= 75){
    classes = "stroke-carrot-orange";
  }
  else if(percentage > 75 && percentage <= 80){
    classes = "stroke-princeton-orange";
  }
  else if(percentage > 80 && percentage <= 85){
    classes = "stroke-orange";
  }
  else if(percentage > 85 && percentage <= 90){
    classes = "stroke-gold";
  }
  else if(percentage > 90 && percentage <= 95){
    classes = "stroke-dark-yellow";
  }
  else if(percentage > 95 && percentage <= 99){
    classes = "stroke-avocado";
  }
  else if(percentage > 99 && percentage <= 100){
    classes = "stroke-green";
  }
  else {
    classes = "grey-stroke";
    $('.checklist-section .ic-check').addClass('text-brightgreen');
  }

 var svg = '<svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg">'
     + '<circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9" />'
     + '<circle class="circle-chart__circle '+classes+'"'
     + 'stroke-dasharray="'+ abs_percentage+',100"    cx="16.9" cy="16.9" r="15.9" />'
     + '<g class="circle-chart__info">'
     + '   <text class="circle-chart__percent" x="17.9" y="12.5">'+percentage_str+'%</text>';

  if(inner_text){
    svg += '<text class="circle-chart__subline" x="16.91549431" y="22">'+inner_text+'</text>'
  }

  svg += ' </g></svg>';

  return svg
}


function makeProgressBar(percentage, inner_text="") {
  var abs_percentage = Math.abs(percentage).toString();
  var classes = "";

  if(percentage < 0){
    classes = "danger-fill circle-chart__circle--negative";
  }
  else if(percentage > 0 && percentage < 5){
    classes = "fill-light-gray";
  }
  else if(percentage > 5 && percentage < 10){
    classes = "fill-light-blue";
  }
  else if(percentage > 10 && percentage < 15){
    classes = "fill-sky-blue";
  }
  else if(percentage > 15 && percentage <= 20){
    classes = "fill-blue-jeans";
  }
  else if(percentage > 20 && percentage <= 25){
    classes = "fill-vivid-cerulean";
  }
  else if(percentage > 25 && percentage <= 30){
    classes = "fill-button-blue";
  }
  else if(percentage > 30 && percentage <= 35){
    classes = "fill-blueberry";
  }
  else if(percentage > 35 && percentage <= 40){
    classes = "fill-dark-blueberry";
  }
  else if(percentage > 40 && percentage <= 45){
    classes = "fill-violet";
  }
  else if(percentage > 45 && percentage <= 50){
    classes = "fill-amethyst";
  }
  else if(percentage > 50 && percentage <= 55){
    classes = "fill-rosepink";
  }
  else if(percentage > 55 && percentage <= 60){
    classes = "fill-mulberry";
  }
  else if(percentage > 60 && percentage <= 65){
    classes = "fill-carmin-pink";
  }
  else if(percentage > 65 && percentage <= 70){
    classes = "fill-orange-soda";
  }
  else if(percentage > 70 && percentage <= 75){
    classes = "fill-carrot-orange";
  }
  else if(percentage > 75 && percentage <= 80){
    classes = "fill-princeton-orange";
  }
  else if(percentage > 80 && percentage <= 85){
    classes = "fill-orange";
  }
  else if(percentage > 85 && percentage <= 90){
    classes = "fill-gold";
  }
  else if(percentage > 90 && percentage <= 95){
    classes = "fill-dark-yellow";
  }
  else if(percentage > 95 && percentage <= 99){
    classes = "fill-avocado";
  }
  else if(percentage > 99 && percentage <= 100){
    classes = "fill-green";
  }
  else {
    classes = "grey-fill";
    $('.checklist-section .ic-check').addClass('text-brightgreen');
  }


  var svg = '<svg class="progress-bar-chart" viewbox="0 0 100 8" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">'
  + '<rect class="progress-bar-chart__background" width="100" height="8" />'
  + '<rect class="progress-bar-chart__bar ' + classes + '" width="' + abs_percentage + '" height="8" />'
  + '</svg>';

var label = '<span class="progress-bar-chart__label">' + percentage + '% ' + inner_text + '</span>';

return {
  svg: svg,
  label: label
};
}


(function( $ ) {

    $.fn.circlechart = function() {
        this.each(function() {
            var percentage = $(this).data("percentage");
            var inner_text = $(this).text();
            $(this).html(makesvg(percentage, inner_text));
        });
        return this;
    };
    $.fn.progressBarChart = function() {
      this.each(function() {
          var percentage = $(this).data("percentage");
          var inner_text = $(this).text();
          var progressBar = makeProgressBar(percentage, inner_text);
          $(this).html(progressBar.svg);
          $(this).prepend(progressBar.label);
          $(this).find('.progress-bar-chart__bar').animate({
              width: percentage + '%'
          }, 2000);  // Animation over 2 seconds
      });
      return this;
  };



}( jQuery ));
