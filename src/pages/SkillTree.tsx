import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const CustomNode = ({ data }) => (
  <div className="bg-gray-800 rounded-full p-2 w-12 h-12 flex items-center justify-center border-2 border-gray-600">
    <img src={data.icon} alt={data.label} className="w-10 h-10" />
  </div>
);

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { icon: '/path/to/icon1.png' } },
  { id: '2', type: 'custom', position: { x: 100, y: 100 }, data: { icon: '/path/to/icon2.png' } },
  { id: '3', type: 'custom', position: { x: 400, y: 100 }, data: { icon: '/path/to/icon3.png' } },
  // Add more nodes as needed
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  // Add more edges as needed
];

const SkillTree = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-900 flex flex-col no-scroll">
      <div className="flex-grow relative">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          style={{
            background: 'rgb(17 24 39)',
            width: '100%',
            height: '100%',
          }}
          minZoom={0.2}
          maxZoom={1.5}
          defaultViewport={{ zoom: 1, x: 0, y: 0 }}
        >
          <Background color="#aaa" gap={16} />
          <Controls className='absolute'/>
        </ReactFlow>
      </div>
    </div>
  );
};

export default SkillTree;