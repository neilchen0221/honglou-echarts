const echarts = require('echarts');
const echarts2 = require('echarts');
const data = require('./data/honglou_english_version.json');
const data2 = require('./data/honglou2.json');
const imageBaseUrl = 'https://datarati-vma.s3-ap-southeast-2.amazonaws.com/Test+Images/circle/';
const bgImageBaseUrl = 'https://datarati-vma.s3-ap-southeast-2.amazonaws.com/Test+Images/background/';

if (document.getElementById('main')) {
	/**************************************/
	/* Chart 1 */
	/*************************************/
	const myChart = echarts.init(document.getElementById('main'));
	let graph = data;
	const categories = Object.keys(graph.categories).map((key) => ({
		name: key
	}));

	//Node data
	graph.data.nodes.forEach(function (node) {
		let name = node.label.split('—');
		let chineseName = name[0];
		let englishName = name[name.length - 1];
		let info = node.info.split('—');
		let chineseInfo = info[0];
		let englishInfo = info[info.length - 1];
		let imageUrl = `${imageBaseUrl}${encodeURIComponent(chineseName)}.png`;

		let labelSize = node.value <= 5 ? 8 : 12;
		node.category = node.categories[0];
		node.name = `${chineseName}|${englishName}`;
		node.symbolSize = node.category === 'event' || node.category === 'location' ? 10 : node.value * 2;
		node.symbol = node.image && node.value >= 3 ? `image://${imageUrl}` : 'circle';
		node.label = {
			show: true,
			fontSize: labelSize
		};
		node.itemStyle = {
			borderWidth: 1.2,
			borderColor: '#ffffff'
		};
		node.tooltip = {
			show: true,
			formatter: function () {
				return `<div style="width:400px;white-space: initial;">${
					node.image ? `<img src='${imageUrl}' width="100" style="float:left;margin-right:15px">` : ''
				}<span style="font-weight:bold;font-size:16px;">${node.name}</span><br>${englishInfo}</div>`;
			}
		};
	});
	//Link data
	graph.data.edges.forEach(function (edge) {
		edge.source = edge.from.toString();
		edge.target = edge.to.toString();
		edge.relationship = edge.label;
		edge.label = {
			formatter: function () {
				return edge.relationship;
			}
		};
	});

	option = {
		title: {
			text: '紅樓夢|Honglou',
			subtext: 'Circular',
			top: 'top',
			left: 'left'
		},
		tooltip: { show: false, confine: true, triggerOn: 'click' },
		legend: {
			data: categories.map(function (a) {
				return a.name;
			}),
			selected: {
				person: false,
				Jinling: true,
				zhuyao: true,
				fuce: false,
				youfuce: false,
				guan: false,
				event: false,
				location: false
			}
		},
		animationDuration: 1500,
		animationEasingUpdate: 'quinticInOut',
		series: [
			{
				zoom: 1,
				name: 'honglou',
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
				itemStyle: {
					borderWidth: 1
				},
				edgeLabel: {
					show: false,
					fontSize: 14
				},
				lineStyle: {
					color: 'source',
					width: 0,
					opacity: 1,
					curveness: 0.15
				},
				emphasis: {
					edgeLabel: { show: true },
					lineStyle: {
						width: 2
					},
					label: {
						fontSize: 16
					}
				}
			}
		]
	};
	myChart.setOption(option);
	window.onresize = myChart.resize;

	myChart.on('mouseover', { dataType: 'node' }, function (params) {
		if (graph.data.nodes[params.dataIndex].category === 'event') {
			document.querySelector('#wrapper-bg').style.backgroundImage = `url("${bgImageBaseUrl}487371474.jpg")`;
		}
	});
	myChart.on('mouseout', { dataType: 'node' }, function (params) {
		document.querySelector('#wrapper-bg').style.backgroundImage = `url("./images/honglou_bg.jpg")`;
	});
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
