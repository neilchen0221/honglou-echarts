const echarts = require('echarts');
const echarts2 = require('echarts');
const data = require('./honglou.json');
const data2 = require('./honglou2.json');

if (document.getElementById('main')) {
	/**************************************/
	/* Chart 1 */
	/*************************************/
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
				return `<div style="width:400px;white-space: initial;">${node.info}</div>`;
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

	option = {
		title: {
			text: '紅樓夢',
			subtext: 'Circular',
			top: 'top',
			left: 'left'
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
} else {
	/**************************************/
	/* Chart 2 */
	/*************************************/
	const myChart2 = echarts2.init(document.getElementById('main2'));
	let graph2 = data2;
	const categories2 = [{ name: 'Community 0' }];

	graph2.data.communities.forEach(function (community) {
		categories2.push({ name: `Community ${community.id}` });
	});

	graph2.data.nodes.forEach(function (node) {
		node.name = node.label;
		node.symbolSize = node.value;
		node.symbol = 'circle';
		node.label = {
			show: true
		};
		node.category = `Community ${node.community}`;
		node.tooltip = {
			formatter: function () {
				return `<div style="width:400px;white-space: initial;">${node.info}</div>`;
			}
		};
	});
	graph2.data.edges.forEach(function (edge) {
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

	option2 = {
		title: {
			text: '紅樓夢',
			subtext: 'Scattered',
			top: 'top',
			left: 'left'
		},
		legend: [
			{
				data: categories2.map(function (a) {
					return a.name;
				})
			}
		],
		tooltip: {},
		animationDuration: 1500,
		animationEasingUpdate: 'quinticInOut',
		series: [
			{
				name: 'Les Miserables',
				type: 'graph',
				layout: 'none',
				circular: {
					rotateLabel: true
				},
				data: graph2.data.nodes,
				links: graph2.data.edges,
				categories: categories2,
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
	myChart2.setOption(option2);
}
