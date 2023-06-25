import * as d3 from 'd3';


export function drawSquares(//Main arguments
                            data: { [key: string]: any }[], 
                            containerName:string,
                            colorScale:any,
                            wantedKey:string,
                            //Additional arguments
                            nbRowInBloc = 4,
                            nbColInBloc = 5,
                            nbBlocCol = 4,
                            svgPadding=20,
                            squareSize=20,
                            smallGap= 5
                            )
                            :void{
    // Geometry Calculus
    let nbCol = nbColInBloc*nbBlocCol,  // 20 columns of squares in total
        nbSquaresinBloc = nbRowInBloc*nbColInBloc; // 20 squares per bloc

    // Selection of the svg  
    const container = d3.select(containerName);
    const svg = container.select('svg');
    svg.selectAll('rect').remove();
    
    // Drawing
    svg.selectAll('rect')
      .data(data)
      .enter()
      // Squares
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("class", 'seat')
      .attr("fill", (d)=>colorScale(d[wantedKey]))
      .attr("x", function(d, i) {
        let col = i % nbCol;
        return col * (squareSize+smallGap);
      })
      .attr("y", function(d, i) {
          let row = Math.floor(i / nbCol);
          return row * (squareSize+smallGap)+svgPadding;
      })
      .attr('row', function(d,i) {
        return Math.floor(i / (nbSquaresinBloc*nbBlocCol));
      })
      .attr('col', function(d,i) {
        return Math.floor(((i%(nbSquaresinBloc*nbBlocCol))%nbCol)/nbColInBloc);
      })
      // Tooltip 
      .on("mouseover", function(d) {
        d3.select("#zone-tooltip").style("opacity", 1);
        var color = d3.select(this).attr('fill');
        d3.select(this)
          .style("stroke", color)
          .style("stroke-width",3) ;
        var x = d3.select(this).attr('x');
        var y = d3.select(this).attr('y');
        var tooltip = d3.select("#zone-tooltip");
        tooltip.select("#p-name").html("Name: " + d["nom"]);
        tooltip.select("#p-province").html("Province: " + d['province']);
        tooltip.select("#p-parti").html("Parti: " + d['parti']);
        
      })
      .on('mouseenter', function (event, d) {
         seatSelected(d3.select(this))
      })
      .on("mouseleave", function(d) {
        d3.select("#zone-tooltip").style("opacity", 0);
        d3.select(this)
          .style("stroke", "none");
      });
}

function seatSelected(element:any){
  const parentElement = element._groups[0][0]
  const parentNode = parentElement.parentNode
  const d = parentElement.__data__
  let tooltip = d3.select("#zone-tooltip")
  tooltip.select("#avatar").attr("src", d['urlPhoto']);
  tooltip.select("#p-name").html("Name: " + d["nom"]);
  tooltip.select("#p-province").html("Province: " + d['province']);
  tooltip.select("#p-parti").html("Parti: " + d['parti']);
}
