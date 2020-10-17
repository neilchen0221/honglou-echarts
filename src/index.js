require('./css/main.css');
const echarts = require('echarts');
const graph = require('./data/honglou_english_version.json');
const { Howl } = require('howler');
const characterAudio = document.querySelector('#sound');
const bgAudio = new Howl({
	src: ['https://honglou-sound.s3-ap-southeast-2.amazonaws.com/background_music_1.mp3'],
	autoplay: true,
	loop: true,
	volume: 0.2
});

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
	node.symbol = node.category !== 'event' && node.category !== 'location' && node.image && node.value >= 3 ? `image://${imageUrl}` : 'circle';
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
// Resize the graph size based on browser window size
window.onresize = myChart.resize;

// Hover data node to change backgorund image
myChart.on('mouseover', { dataType: 'node' }, function (params) {
	const nodeData = graph.data.nodes[params.dataIndex];
	let eventImageUrl = `${eventImageBaseUrl}${encodeURIComponent(nodeData.chineseName)}.jpg`;
	if (nodeData.category === 'event' && nodeData.image !== 'no image') {
		document.querySelector('#wrapper-bg').style.backgroundImage = `url("${eventImageUrl}")`;
	}
});
myChart.on('mouseout', { dataType: 'node' }, function (params) {
	document.querySelector('#wrapper-bg').style.backgroundImage = `url("https://honglou-image.s3-ap-southeast-2.amazonaws.com/honglou_bg_1.jpg")`;
});

// Click data node to play sound
myChart.on('click', { dataType: 'node' }, function (params) {
	const nodeData = graph.data.nodes[params.dataIndex];
	if (nodeData.sound) {
		characterAudio.src = `https://honglou-sound.s3-ap-southeast-2.amazonaws.com/${encodeURIComponent(nodeData.chineseName)}.mp3`;
		characterAudio.volume = 1;
		characterAudio.play();
	}
});

// Reduce background music volume when playing character sound
characterAudio.onplay = function () {
	bgAudio.fade(bgAudio.volume(), 0.04, 1000);
};
characterAudio.onended = function () {
	bgAudio.fade(bgAudio.volume(), 0.2, 1000);
};

// Force background music to play as soon as web page is loaded
bgAudio.play();
