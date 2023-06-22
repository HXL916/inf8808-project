import * as d3 from 'd3';


export function drawSquares(//Main arguments
                            data: { [key: string]: any }[], 
                            containerName:string,
                            colorScale:any,
                            wantedKey:string,

                            //Additional arguments
                            svgPadding=20,
                            squareSize=20,
                            smallGap= 5,
                            nbRowInBloc = 4,
                            nbColInBloc = 5,
                            nbBlocCol = 4,)
                            :void{
    let nbCol = nbColInBloc*nbBlocCol,  // 20 columns of squares in total
        nbSquaresinBloc = nbRowInBloc*nbColInBloc; // 20 squares per bloc
    
    const container = d3.select(containerName);
    const svg = container.select('svg');
    svg.selectAll('rect').remove();

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("class", function(d,i){
        return 'seat-'+String(i);
      })
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
      });
}
