/// <reference lib="dom" />
import './App.css';
import React, { useEffect, useState, useRef } from 'react';


const MoleculeRenderer = ({ atomData, bondData, num }) => {
  const canvasRef = useRef(null);

  function resizeCanvas(canvas) {
    const { width, height } = canvas.getBoundingClientRect();
    const { devicePixelRatio: ratio = 1 } = window;
    const context = canvas.getContext('2d');
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.scale(ratio, ratio);
      return true;
    }
    return false;
  }

  useEffect(() => { 
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.clientWidth, canvasRef.current.clientHeight);

    resizeCanvas(canvas);
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    

    ctx.clearRect(0, 0, canvasRef.current.clientWidth, canvasRef.current.clientHeight);

    // Draw Bonds

    bondData.atom1.forEach((atom1Index, index) => {
      const atom2Index = bondData.atom2[index];
      const bondType = bondData.bond_type[index];
      
      // ... [your scaling calculations remain unchanged]
      
      var x1 = scaleValue(atomData.x_coord[atom1Index], Math.min(...atomData.x_coord), Math.max(...atomData.x_coord), canvasRef.current.clientWidth*.15, canvasRef.current.clientWidth*.85);
      var y1 = scaleValue(atomData.y_coord[atom1Index], Math.min(...atomData.y_coord), Math.max(...atomData.y_coord), canvasRef.current.clientHeight*.15, canvasRef.current.clientHeight*.85);
      var x2 = scaleValue(atomData.x_coord[atom2Index], Math.min(...atomData.x_coord), Math.max(...atomData.x_coord), canvasRef.current.clientWidth*.15, canvasRef.current.clientWidth*.85);
      var y2 = scaleValue(atomData.y_coord[atom2Index], Math.min(...atomData.y_coord), Math.max(...atomData.y_coord), canvasRef.current.clientHeight*.15, canvasRef.current.clientHeight*.85);


      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ux = dy / len;
      const uy = -dx / len;
      
      const separation = 6; // Change this value for different bond separation distances
  
      ctx.lineWidth = 4; // Adjust as per requirement
  
      // Single bond
      if (bondType === 1) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'black';
          ctx.stroke();
      }

      if (bondType === 1.5) {
        ctx.beginPath();
        ctx.moveTo(x1 + ux * separation, y1 + uy * separation);
        ctx.lineTo(x2 + ux * separation, y2 + uy * separation);
        ctx.moveTo(x1 - ux * separation, y1 - uy * separation);
        ctx.lineTo(x2 - ux * separation, y2 - uy * separation);
        ctx.strokeStyle = 'grey';
        ctx.stroke();
  }

  
      // Double bond
      if (bondType === 2) {
          ctx.beginPath();
          ctx.moveTo(x1 + ux * separation, y1 + uy * separation);
          ctx.lineTo(x2 + ux * separation, y2 + uy * separation);
          ctx.moveTo(x1 - ux * separation, y1 - uy * separation);
          ctx.lineTo(x2 - ux * separation, y2 - uy * separation);
          ctx.strokeStyle = 'black';
          ctx.stroke();
      }
  
      // Triple bond
      if (bondType === 3) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.moveTo(x1 + 2 * ux * separation, y1 + 2 * uy * separation);
          ctx.lineTo(x2 + 2 * ux * separation, y2 + 2 * uy * separation);
          ctx.moveTo(x1 - 2 * ux * separation, y1 - 2 * uy * separation);
          ctx.lineTo(x2 - 2 * ux * separation, y2 - 2 * uy * separation);
          ctx.strokeStyle = 'black';
          ctx.stroke();
      }
  });

    // Draw Atoms
    atomData.x_coord.forEach((x2, index) => {
      const y2 = atomData.y_coord[index];
      const label = atomData.atom_label[index];
      let num_Hs2 = atomData.num_Hs[index].replace(/&/g, "")
      let num_Hs = num_Hs2.substring(1, num_Hs2.length - 1);
      let atom_num = num_Hs.split(":")[1]
      num_Hs = num_Hs.split(":")[0]


      var x = canvasRef.current.clientWidth/2
      var y = canvasRef.current.clientHeight/2

      if (atomData.x_coord.length === 1){
        x = canvasRef.current.clientWidth/2
        y = canvasRef.current.clientHeight/2
      } else{ 
        x = scaleValue(x2, Math.min(...atomData.x_coord), Math.max(...atomData.x_coord), canvasRef.current.clientWidth*.15, canvasRef.current.clientWidth*.85);
        y = scaleValue(y2, Math.min(...atomData.y_coord), Math.max(...atomData.y_coord), canvasRef.current.clientHeight*.15, canvasRef.current.clientHeight*.85);  
      }

      ctx.beginPath();
      var font = 'bold 6px Arial'
      var x_adj = -10
      var y_adj = 3
      var x_adj2 = +7.25
      var y_adj2 = 6

      if (num > 1){
        ctx.arc(x, y, 11, 0, 2 * Math.PI, false);
        font = 'bold 6px Arial'
        x_adj = -10
        y_adj = 3
        x_adj2 = +7.25
        y_adj2 = 6

      }
      else{
        ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
        font = 'bold 8px Arial';
        x_adj = -14
        y_adj = 2.5
        x_adj2 = +9
        y_adj2 = 7.5
      }
      ctx.fillStyle = 'white';

      if (label === "C" || label === "c"){
        ctx.fillStyle = '#EDEDED';
      }

      if (label === "O" || label === "o"){
        ctx.fillStyle = '#FF6347';
      }

      if (label === "N" || label === "n"){
        ctx.fillStyle = '#CCF5FF';
      }

      if (label === "P" || label === "p"){
        ctx.fillStyle = 'orange';
      }


      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.fillStyle = 'black';

      
      ctx.font = font // added 'bold' keyword
      ctx.fillText(num_Hs, x + x_adj, y + y_adj);
      ctx.fillText(atom_num, x + x_adj + x_adj2, y + y_adj + y_adj2);

    });

  }, [atomData, bondData, num]);

  if (num > 1){

    return <canvas ref={canvasRef} style={{height:"100%", width:"100%"}}className='canvasMol'/>;
  }
  else{
    return <canvas ref={canvasRef} style={{width:"50%", height:"50%", maxHeight:"100%"}}className='canvasMol'/>;
  }
};




/**
 * @param {number} value
 * @param {number} inputMin
 * @param {number} inputMax
 * @param {number} outputMin
 * @param {number} outputMax
 */
function scaleValue(value, inputMin, inputMax, outputMin, outputMax) {
  // Scale the value to (0, 1) of the input range
  var scaledValue = (value - inputMin) / (inputMax - inputMin);

  // Scale the value to the output range
  scaledValue = scaledValue * (outputMax - outputMin) + outputMin;

  // Return the scaled value
  return scaledValue;
}



function App() {
  const [molDatas, setMolDatas] = useState([])
  const [bondDatas, setBondDatas] = useState([])

  useEffect(() => {
    // Message listener
    const eventListener = (event) => {
      const message = event.data; // The JSON data our extension sent
      switch (message.command) {
        case 'pythonOutput':
          setMolDatas(message.output.mol)
          setBondDatas(message.output.bond)
          break;
        default:
          console.log(`Unknown command: ${message.command}`);
      }
    };
    window.addEventListener('message', eventListener);

    return () => {
      // Cleanup listener on component unmount
      window.removeEventListener('message', eventListener);
    };
  }, []);

  function renderMolecules(){
    let mol_render = []
    if (molDatas.length !== bondDatas.length){
      return mol_render
    }
    let first = true
    for (let i = 0; i < molDatas.length; i++) {
      let border = ""
      if (first && molDatas[i]["mol_class"][0] === "product"){
        border = "1px solid black"
        first = false
      }
      mol_render.push(
        <div className='molRender' style={{"borderLeft": border}}>
          <MoleculeRenderer atomData={molDatas[i]} bondData={bondDatas[i]} num={molDatas.length}/>
        </div>
      )
    }
    return <div className='smartsImage'>{mol_render}</div>
  }

  return (
    <div className="App">
      {renderMolecules()} {/* Render the code */}
    </div>
  );
}


export default App;
