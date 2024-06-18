import React, { useEffect, useRef } from "react";
import { Graph, Point } from "@antv/x6";

const OrgChart = ({ data }) => {
  const containerRef = useRef(null);
  console.log(data);
  useEffect(() => {
    Graph.registerNode(
      "org-node",
      {
        width: 180,
        height: 60,
        markup: [
          {
            tagName: "rect",
            selector: "body",
          },
          {
            tagName: "image",
            selector: "avatar",
          },
          {
            tagName: "text",
            selector: "rank",
          },
          {
            tagName: "text",
            selector: "name",
          },
        ],
        attrs: {
          body: {
            refWidth: "100%",
            refHeight: "100%",
            fill: "#5F95FF",
            stroke: "#5F95FF",
            strokeWidth: 1,
            rx: 10,
            ry: 10,
            pointerEvents: "visiblePainted",
          },
          avatar: {
            width: 48,
            height: 48,
            refX: 8,
            refY: 6,
          },
          rank: {
            refX: 0.9,
            refY: 0.2,
            fill: "#fff",
            fontFamily: "Courier New",
            fontSize: 14,
            textAnchor: "end",
            textDecoration: "underline",
          },
          name: {
            refX: 0.9,
            refY: 0.6,
            fill: "#fff",
            fontFamily: "Courier New",
            fontSize: 14,
            fontWeight: "800",
            textAnchor: "end",
          },
        },
      },
      true
    );

    Graph.registerEdge(
      "org-edge",
      {
        zIndex: -1,
        attrs: {
          line: {
            fill: "none",
            strokeLinejoin: "round",
            strokeWidth: 2,
            stroke: "#A2B1C3",
            sourceMarker: null,
            targetMarker: null,
          },
        },
      },
      true
    );

    const graph = new Graph({
      container: containerRef.current,
      connecting: {
        anchor: "orth",
      },
    });

    function member(x, y, rank, name, image) {
      return graph.addNode({
        x,
        y,
        shape: "org-node",
        attrs: {
          avatar: {
            opacity: 0.7,
            "xlink:href": image,
          },
          rank: {
            text: rank,
            wordSpacing: "-5px",
            letterSpacing: 0,
          },
          name: {
            text: name,
            fontSize: 13,
            fontFamily: "Arial",
            letterSpacing: 0,
          },
        },
      });
    }

    function link(source, target, vertices) {
      return graph.addEdge({
        vertices,
        source: {
          cell: source,
        },
        target: {
          cell: target,
        },
        shape: "org-edge",
      });
    }

    // Replace with your images
    const male =
      "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ";
    const female =
      "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ";

    const nodes = {};
    const edges = [];

    // Create the manager node
    const manager = member(
      300,
      70,
      "Manager",
      data?.manage?.fullname || "Vị trí đang trống",
      data?.manage
        ? data?.manage?.avatar
          ? `${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_AVATAR}${data?.manage?.avatar}`
          : data?.manage?.gender === "x"
          ? male
          : female
        : ""
    );
    nodes[data?.id] = manager;
    const midY = 160;
    // Create staff nodes and links
    data?.staff.forEach((staffMember, index) => {
      const staffNode = member(
        90 + index * 200,
        200,
        "Staff",
        staffMember.fullname,
        female
      );
      nodes[staffMember.id] = staffNode;
      const vertices = [
        { x: manager.getBBox().center.x, y: midY },
        { x: staffNode.getBBox().center.x, y: midY },
      ];

      edges.push(link(manager, staffNode, vertices));
      // edges.push(link(manager, staffNode, [{ x: 175 + index * 200, y: 180 }]));
    });

    graph.resetCells(Object.values(nodes).concat(edges));
    graph.zoomToFit({ padding: 20, maxScale: 1 });
  }, [data]);

  return (
    <div
      id="container"
      ref={containerRef}
      style={{ width: "100%", height: "80vh", background: "#f0f0f0" }}
    />
  );
};

export default OrgChart;
