import * as d3 from 'd3';


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
                            squareSize=20,
                            smallGap= 5
                            )
                            :void{
    // Geometry Calculus
    let nbRow = nbRowInBloc*nbBlocRow,
        nbSquaresinBloc = nbRowInBloc*nbColInBloc; // 20 squares per bloc

    // Selection of the svg  
    const container = d3.select(containerName);
    const svg = container.append('svg').attr("id","waffleRow");
    
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

