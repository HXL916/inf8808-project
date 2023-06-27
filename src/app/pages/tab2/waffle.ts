import * as d3 from 'd3';

//import d3TipFactory from 'd3-tip'
//import d3Tip from 'd3-tip';
//(d3 as any).tip = d3Tip;

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


    var tooltip = d3.select("#graph-container")
      .append("div")
      .attr("class", "tooltip")
      .style("position","absolute")
      .style("background-color", "rgba(138, 180, 118, 0.8)")
      .style('border-radius', '10px 10px 0px 10px')
      .style("padding", "5px")
      .style('pointer-events','none')

      
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

    d3.selectAll(".seat")
      .on("mouseover", function(event, d){
        var color = d3.select(this).attr('fill');
        d3.select(this)
          .style("stroke", color)
          .style("stroke-width",3) ;
        return tooltip.style("visibility", "visible");})
      .on("mousemove", function(event, d:any){
        const el = document.getElementById('zone-chart') as any;
        var viewportOffset = el.getBoundingClientRect();
        return tooltip
          .style("top", (d3.pointer(event)[1]*1.05+viewportOffset["y"])-95+"px")
          .style("left",(d3.pointer(event)[0]*1.05+viewportOffset["x"])-240+"px")
          .html(getTooltipContents(d));
      })
      .on("mouseout", function(){
        d3.select(this)
        .style("stroke", "none");
        return tooltip.style("visibility", "hidden");});
}

function seatSelected(element:any){
  const parentElement = element._groups[0][0]
  const parentNode = parentElement.parentNode
  const d = parentElement.__data__
  let tooltip = d3.select("#zone-tooltip")
  tooltip.select("#avatar").attr("src", d['urlPhoto']);
  tooltip.select("#p-name").html(d["nom"]);
  tooltip.select("#p-province").html("Province: " + d['province']);
  tooltip.select("#p-parti").html("Parti: " + d['parti']);
}


function getTooltipContents(d:any):string{
  const tooltipDiv = d3.create('div')
  .classed('tooltip-div', true)
  .style('display','flex')
  .style('flex-direction','row')
  .style('padding', '5px')
  .style('width', '250px')


  tooltipDiv.append('img')
    .attr('src', d["urlPhoto"])
    .style('height', '100px')
    .style('width', '100px')
    .style('object-fit','cover')
    .style('object-position', '0 10%')
    .style('border-radius', '10px ')
    

  const tooltipTextDiv = tooltipDiv.append('div')
    .style('display', 'flex')
    .style('flex-direction', 'column')
    .style('justify-content', 'space-between')
    .style('padding-left', '10px')
    .style('font-size', '1.2em')

    tooltipTextDiv.append('div')
    .style('font-size', '1.4em')
    .style('font-weight', '600')
    .text(d["nom"]);

    tooltipTextDiv.append('div')
      .text('Parti: '+d["parti"]);

    tooltipTextDiv.append('div')
    .text('Province: '+d["province"]);

  const tooltipNode = tooltipDiv.node();
  if (tooltipNode) {
    return tooltipNode.outerHTML;
  }

  return '';
}


