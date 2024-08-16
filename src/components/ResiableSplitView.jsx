import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const ResiableSplitView = ({ direction = "vertical" ,children}) => {
  const [size, setSize] = useState(direction === "vertical" ? 300 : 300);

  const handleResize = (event, { size }) => {
    setSize(direction === "vertical" ? size.height : size.width);
  };

  if (direction === "vertical") {
    return (
      <div className="flex-1 h-screen">
        <ResizableBox
          className="bg-blue-500 text-white z-10"
          height={size}
          width={Infinity}
          resizeHandles={["s"]}
          onResize={handleResize}
          axis="y"
          handle={<div className="h-2 bg-gray-300 cursor-row-resize z-40" />}
        >
          <div className="h-full flex items-center justify-center">
            {children[0]}
          </div>
        </ResizableBox>
        <div

          className="bg-slate-800 text-white flex items-center justify-center overflow-auto z-10"

          style={{ height: `calc(100% - ${size}px)` }}
        >
          {children[1]}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-screen h-full">
      <ResizableBox
        className="bg-blue-500 text-white"
        height={Infinity}
        width={size}
        resizeHandles={["e"]}
        onResize={handleResize}
        axis="x"
        handle={<div className="w-2 bg-gray-300 cursor-col-resize" />}
      >
        <div className="h-full flex items-center justify-center">
        {children[0]}
        </div>
      </ResizableBox>
      <div
        className="bg-green-500 text-white flex items-center justify-center"
        style={{ width: `calc(100% - ${size}px)` }}
      >
          {children[1]}
      </div>
    </div>
  );
};

export default ResiableSplitView;
