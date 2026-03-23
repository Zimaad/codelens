import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';

/**
 * DependencyGraph — D3.js v7 force-directed graph with zoom, click-to-highlight,
 * arrowhead edges, and a language color legend.
 */

const LANG_COLORS = {
  python: '#3b82f6', py: '#3b82f6',
  javascript: '#eab308', js: '#eab308',
  typescript: '#2dd4bf', ts: '#2dd4bf', tsx: '#2dd4bf',
  go: '#10b981', rust: '#f97316', java: '#f97316', ruby: '#ef4444',
  json: '#a78bfa', css: '#38bdf8', html: '#f97316',
  default: '#4f5b73',
};

const LEGEND_ITEMS = [
  { label: 'Python', color: '#3b82f6' },
  { label: 'JavaScript', color: '#eab308' },
  { label: 'TypeScript', color: '#2dd4bf' },
  { label: 'Other', color: '#4f5b73' },
];

function getColor(language) {
  const lang = (language || '').toLowerCase();
  return LANG_COLORS[lang] || LANG_COLORS.default;
}

function getRadius(inDegree) {
  return Math.max(8, Math.min(28, 8 + inDegree * 3));
}

export default function DependencyGraph({ nodes = [], edges = [], onNodeSelect }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const neighborsMap = useRef(new Map());

  useEffect(() => {
    const map = new Map();
    nodes.forEach((n) => map.set(n.id, new Set()));
    edges.forEach((e) => {
      const sid = typeof e.source === 'object' ? e.source.id : e.source;
      const tid = typeof e.target === 'object' ? e.target.id : e.target;
      if (map.has(sid)) map.get(sid).add(tid);
      if (map.has(tid)) map.get(tid).add(sid);
    });
    neighborsMap.current = map;
  }, [nodes, edges]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const handleNodeClick = useCallback(
    (event, d) => {
      event.stopPropagation();
      const nodeId = d.id;
      setSelectedNode((prev) => (prev === nodeId ? null : nodeId));
      onNodeSelect?.(nodeId);
    },
    [onNodeSelect]
  );

  const handleBgClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    defs.append('marker').attr('id', 'arrowhead').attr('viewBox', '0 -5 10 10').attr('refX', 20).attr('refY', 0).attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L10,0L0,4').attr('fill', '#1c2232');

    defs.append('marker').attr('id', 'arrowhead-active').attr('viewBox', '0 -5 10 10').attr('refX', 20).attr('refY', 0).attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L10,0L0,4').attr('fill', '#00ffe0');

    defs.append('marker').attr('id', 'arrowhead-dim').attr('viewBox', '0 -5 10 10').attr('refX', 20).attr('refY', 0).attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L10,0L0,4').attr('fill', '#0c0f16');

    // Radial gradient for graph background
    const bgGrad = defs.append('radialGradient').attr('id', 'graphBg').attr('cx', '50%').attr('cy', '50%').attr('r', '60%');
    bgGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0c0f16');
    bgGrad.append('stop').attr('offset', '100%').attr('stop-color', '#06080c');

    const g = svg.append('g').attr('class', 'graph-container');

    const zoom = d3.zoom().scaleExtent([0.2, 4]).on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

    svg.call(zoom);
    svg.on('click', handleBgClick);

    const simNodes = nodes.map((n) => ({ ...n }));
    const simEdges = edges.map((e) => ({ ...e }));

    const simulation = d3
      .forceSimulation(simNodes)
      .force('link', d3.forceLink(simEdges).id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => getRadius(d.inDegree) + 4));

    simulationRef.current = simulation;

    const link = g.append('g').attr('class', 'links').selectAll('line').data(simEdges).join('line')
      .attr('stroke', '#1c2232')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.5)
      .attr('marker-end', 'url(#arrowhead)');

    const nodeGroup = g.append('g').attr('class', 'nodes').selectAll('g').data(simNodes).join('g')
      .attr('cursor', 'pointer')
      .call(
        d3.drag()
          .on('start', (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Outer glow circle
    nodeGroup.append('circle')
      .attr('r', (d) => getRadius(d.inDegree) + 4)
      .attr('fill', (d) => getColor(d.language))
      .attr('fill-opacity', 0.06);

    // Main circle
    nodeGroup.append('circle')
      .attr('r', (d) => getRadius(d.inDegree))
      .attr('fill', (d) => getColor(d.language))
      .attr('fill-opacity', 0.8)
      .attr('stroke', (d) => getColor(d.language))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.3);

    // Inner highlight
    nodeGroup.append('circle')
      .attr('r', (d) => getRadius(d.inDegree) * 0.4)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.08);

    // Labels
    nodeGroup.filter((d) => d.inDegree > 2).append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => getRadius(d.inDegree) + 14)
      .attr('font-size', '10px')
      .attr('font-family', "'ClashDisplay', sans-serif")
      .attr('font-weight', '500')
      .attr('fill', '#8892a8')
      .attr('pointer-events', 'none');

    nodeGroup.on('click', handleNodeClick);

    simulation.on('tick', () => {
      link.attr('x1', (d) => d.source.x).attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x).attr('y2', (d) => d.target.y);
      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    simulation.on('end', () => {
      const xs = simNodes.map((n) => n.x);
      const ys = simNodes.map((n) => n.y);
      const x0 = Math.min(...xs) - 40;
      const y0 = Math.min(...ys) - 40;
      const x1 = Math.max(...xs) + 40;
      const y1 = Math.max(...ys) + 40;
      const bw = x1 - x0;
      const bh = y1 - y0;
      const scale = Math.min(width / bw, height / bh, 1.5) * 0.85;
      const tx = width / 2 - ((x0 + x1) / 2) * scale;
      const ty = height / 2 - ((y0 + y1) / 2) * scale;
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    });

    return () => { simulation.stop(); };
  }, [nodes, edges, dimensions, handleNodeClick, handleBgClick]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    if (!selectedNode) {
      svg.selectAll('.nodes g').attr('opacity', 1);
      svg.selectAll('.links line')
        .attr('stroke', '#1c2232')
        .attr('stroke-opacity', 0.5)
        .attr('marker-end', 'url(#arrowhead)');
      return;
    }

    const neighbors = neighborsMap.current.get(selectedNode) || new Set();

    svg.selectAll('.nodes g').attr('opacity', (d) => {
      if (d.id === selectedNode || neighbors.has(d.id)) return 1;
      return 0.15;
    });

    svg.selectAll('.links line')
      .attr('stroke-opacity', (d) => {
        const sid = typeof d.source === 'object' ? d.source.id : d.source;
        const tid = typeof d.target === 'object' ? d.target.id : d.target;
        if (sid === selectedNode || tid === selectedNode) return 0.8;
        return 0.05;
      })
      .attr('stroke', (d) => {
        const sid = typeof d.source === 'object' ? d.source.id : d.source;
        const tid = typeof d.target === 'object' ? d.target.id : d.target;
        if (sid === selectedNode || tid === selectedNode) return '#00ffe0';
        return '#0c0f16';
      })
      .attr('marker-end', (d) => {
        const sid = typeof d.source === 'object' ? d.source.id : d.source;
        const tid = typeof d.target === 'object' ? d.target.id : d.target;
        if (sid === selectedNode || tid === selectedNode) return 'url(#arrowhead-active)';
        return 'url(#arrowhead-dim)';
      });
  }, [selectedNode]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} style={{ display: 'block' }} />

      {/* Legend */}
      <div
        className="absolute bottom-4 left-4 flex flex-col gap-1.5 px-3 py-2.5 rounded-xl"
        style={{
          backgroundColor: 'rgba(6, 8, 12, 0.85)',
          border: '1px solid var(--color-border-subtle)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>
          Language
        </span>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, opacity: 0.85 }} />
            <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Zoom hint */}
      <div
        className="absolute top-3 right-3 px-3 py-1.5 rounded-lg"
        style={{
          backgroundColor: 'rgba(6, 8, 12, 0.7)',
          border: '1px solid var(--color-border-subtle)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>
          Scroll to zoom · Drag to pan · Click node to focus
        </span>
      </div>
    </div>
  );
}
