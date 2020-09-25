const echarts = require('echarts');
const data = require('./honglou.json');

const myChart = echarts.init(document.getElementById('main'));

let graph = data;

const categories = [{ name: 'event' }, { name: 'person' }, { name: 'location' }];

graph.data.nodes.forEach(function (node) {
	node.name = node.label;
	node.symbolSize = node.value * 2;
	node.symbol = 'circle';
	node.label = {
		show: true
	};
	node.category = node.categories[0];
	node.tooltip = {
		formatter: function () {
			return node.info;
		}
	};
});
graph.data.edges.forEach(function (edge) {
	edge.source = edge.from.toString();
	edge.target = edge.to.toString();
	edge.relationship = edge.label;
	edge.label = {
		show: true,
		formatter: function () {
			return edge.relationship;
		}
	};
});

console.log(graph.data.edges);

option = {
	title: {
		text: '紅樓夢',
		subtext: 'Default layout',
		top: 'bottom',
		left: 'right'
	},
	tooltip: {},
	legend: [
		{
			// selectedMode: 'single',
			data: categories.map(function (a) {
				return a.name;
			})
		}
	],
	animationDuration: 1500,
	animationEasingUpdate: 'quinticInOut',
	series: [
		{
			name: 'Les Miserables',
			type: 'graph',
			layout: 'circular',
			circular: {
				rotateLabel: true
			},
			data: graph.data.nodes,
			links: graph.data.edges,
			categories: categories,
			roam: true,
			focusNodeAdjacency: true,
			label: {
				position: 'right',
				formatter: '{b}'
			},
			lineStyle: {
				color: 'source',
				curveness: 0.3
			}
		}
	]
};

myChart.setOption(option);
