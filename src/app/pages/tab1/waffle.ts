import * as d3 from 'd3';
import * as d3Legend from 'd3-svg-legend';


export function drawSquares(//Main arguments
                            data: { [key: string]: any }[], 
                            containerName:string,
                            colorScale:any,
                            wantedKey:string,
                            rowNumber:number,
                            //Additional arguments
                            nbRowInBloc = 4,
                            nbColInBloc = 5,
                            nbBlocRow = 1,
                            svgPadding=20,
                            squareSize=18,
                            smallGap= 5
                            )
                            :void{
    // Geometry Calculus
    let nbRow = nbRowInBloc*nbBlocRow,
        nbSquaresinBloc = nbRowInBloc*nbColInBloc; // 20 squares per bloc

    // Selection of the svg  
    const container = d3.select(containerName);
    const svg = container.append('svg').attr("class","waffleRow");
    
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
        let col = Math.floor(i / nbRow);
        return col * (squareSize+smallGap);
      })
      .attr("y", function(d, i) {
          let row = (i%nbRowInBloc);
          return row * (squareSize+smallGap)+svgPadding;
      })
      .attr('row', rowNumber)
      .attr('col', function(d,i) {
        return Math.floor(i/nbSquaresinBloc);
      })
}

export function drawWaffleLegend(colorScale:any, scale?:number):void{
  const width = 10 // à voir si on peut utiliser une variable globale pour ça, width du waffle chart (faudra peut etre soustraire quelque chose ici)
  // j'ajoute directement au svg du waffle chart puis je crée un groupe (g) legend
  d3.select("#legendContainer").selectAll('svg').remove();
  
  var container = d3.select("#legendContainer")
    .append("svg");

  container.append('g')
     .attr('class', 'legend')
     .attr('transform', 'translate(' + width + ',+20)') 

  var legend = d3Legend.legendColor()
    .shape('path', d3.symbol().type(d3.symbolSquare).size(250)()!) // mettre point d'exclamation à la fin parce qu'on sait que c'est non null
    .title('Légende:')
    .shapePadding(10)
    .cells(6)
    .orient('vertical')
    .scale(colorScale)  as any

    container.select('.legend')
      .call(legend)

    if (typeof(scale)!=='undefined'){
      // Ajout de la cellule suplémentaire qui dit "un carré c'est 1000 interventions"
      const explanationCell = d3.select(".legendCells")
                                .append("g")
                                .attr("class", "explanationCell")
                                .attr('transform', 'translate(0,180)')
      // On récupère la forme des éléments de la légende + la transformation sur le label
      const path = container.select(".swatch").attr("d")
      const transform = container.select(".label").attr("transform")
      explanationCell.append("path")
        .attr("d", path)
        .attr("fill","white")
        .attr("stroke", "black")
      explanationCell.append("text")
        .attr('transform' , transform)
        .text("= "+scale+" interventions")
    }
    
  }
