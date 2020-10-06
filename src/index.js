const echarts = require('echarts');
const graph = require('./data/honglou_english_version.json');
const imageBaseUrl = 'https://honglou-image.s3-ap-southeast-2.amazonaws.com/characters/';
const eventImageBaseUrl = 'https://honglou-image.s3-ap-southeast-2.amazonaws.com/event/';

const myChart = echarts.init(document.getElementById('main'), null, { devicePixelRatio: 2 });
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
	node.chineseName = chineseName;
	node.category = node.categories[0];
	node.name = `${chineseName}|${englishName}`;
	node.symbolSize = node.category === 'event' || node.category === 'location' ? 12 : node.value * 2.5;
	node.symbol = node.image && node.value >= 3 ? `image://${imageUrl}` : 'circle';
	node.label = {
		show: true,
		fontSize: labelSize
	};

	node.itemStyle = {
		borderWidth: 0.6,
		borderColor: '#ffffff'
	};

	node.tooltip = {
		show: true,
		formatter: function () {
			return `<div style="width:400px;white-space: initial;">${
				node.image ? `<img src="${imageUrl}" width="100" style="float:left;margin-right:15px">` : ''
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
		text: '红楼梦|Dream of the Red Chamber',
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
					width: 1.5
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
document.querySelector('#wrapper-bg').style.backgroundImage = `url("./images/background/honglou_bg_1.jpg")`;

myChart.on('mouseover', { dataType: 'node' }, function (params) {
	const nodeData = graph.data.nodes[params.dataIndex];
	let eventImageUrl = `${eventImageBaseUrl}${encodeURIComponent(nodeData.chineseName)}.jpg`;
	if (nodeData.category === 'event') {
		document.querySelector('#wrapper-bg').style.backgroundImage = `url("${eventImageUrl}")`;
	}
});
myChart.on('mouseout', { dataType: 'node' }, function (params) {
	document.querySelector('#wrapper-bg').style.backgroundImage = `url("./images/background/honglou_bg_1.jpg")`;
});
