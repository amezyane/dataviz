$(document).ready(function(){
  $("#start-button").on('click', function(){
    $("#global").animate({top:"-100%"}, 1000);  
  });
});

$(window).resize(function(){
  svg
    .attr("height", $("#map").height())
    .attr("width", $("#map").width());
});

$('#info').css("top", ($(window).height()*2));

var m_width = $("#map").width(),
    width = $("#map").width(),
    height = $("#map").height(),
    country,
    state;

var projection = d3.geo.mercator()
    .scale(150)
    .translate([width/2.2, height/1.5]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", country_clicked);

var g = svg.append("g");


d3.json("assets/json/countries.topo.json", function(error, us) {
  g.append("g")
    .attr("id", "countries")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.countries).features)
    .enter()
    .append("path")
    .attr("id", function(d) { return d.id; })
    .attr("d", path)
    .on("click", country_clicked);
});


function zoom(xyz, d) {

  // Si "d" est défini on zoome, sinon on dézoome

  if(d)
  {
    // on zoome selon les variables créées dans "continent.js"
    xyz[0]=Pays[Tab[d.id]][0];
    xyz[1]=Pays[Tab[d.id]][1];
    xyz[2]=Pays[Tab[d.id]][2];

    // Si le continent en cours est le même que celui du pays sélectionné (Tab[d.id])
    // alors on entre dans la condition.
    // C'est dans cette condition que l'on pourra ajouté les graphiques et autres éléments liés à un pays
    if(continentEnCours == Tab[d.id])
    {
      // Si le pays sélectionné appartient au continent, c'est qu'on a déjà fait un zoom sur le continent.
      // Par conséquent, ici, on place le code lorsque l'on veut avoir des informations sur un pays
      // (graphiques, cadres informatifs, etc.)

      // d.id = le trigramme (FRA) du pays, c'est ainsi que l'on sait quel pays est sélectionné
    }
    continentEnCours = Tab[d.id];
  }

  g.transition()
    .duration(750)
    .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
    .selectAll(["#countries", "#states", "#cities"])
    .style("stroke-width", 1.0 / xyz[2] + "px")
    .selectAll(".city")
    .attr("d", path.pointRadius(20.0 / xyz[2]));
}

function get_xyz(d) {
  var bounds = path.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
}

function country_clicked(d) {
  var nameCountry = '';
  if (typeof d != "undefined") {
    nameCountry = d.id;
    $("#info").css('display', 'block').animate({"top" : ($(window).height()*2-$("#info").height())},500);
  }else{
    $("#info").css('display', 'block').animate({"top" : ($(window).height()*2)},500);
  }

  g.selectAll(["#states", "#cities"]).remove();
  state = null;

  if (country) {
    console.log(country);
    g.selectAll("#" + country.id).style('display', null);
  }

  if (d && country !== d) {
    var xyz = get_xyz(d);
    country = d;
      zoom(xyz, d);
  } else {
    var xyz = [width / 2, height / 1.5, 1];
    country = null;
    zoom(xyz, d);
  }
}
