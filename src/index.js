require('./css/main.css');
const echarts = require('echarts');
const graph = require('./data/honglou_english_version.json');
const { Howl } = require('howler');
const characterAudio = document.querySelector('#sound');
const bgAudio = new Howl({
	src: ['https://honglou-sound.s3-ap-southeast-2.amazonaws.com/background_music_1.mp3'],
	loop: true,
	volume: 0.2,
	onplayerror: function () {
		bgAudio.once('unlock', function () {
			bgAudio.play();
		});
	}
});

const imageBaseUrl = 'https://honglou-image.s3-ap-southeast-2.amazonaws.com/characters/';
const eventImageBaseUrl = 'https://honglou-image.s3-ap-southeast-2.amazonaws.com/event/';
const iconImageBaseUrl = 'https://honglou-image.s3-ap-southeast-2.amazonaws.com/icons/';

const myChart = echarts.init(document.getElementById('main'), null, { devicePixelRatio: 2 });
// const categories = Object.keys(graph.categories).map((key) => ({
// 	name: key
// }));

const categories = [
	{ name: 'Others', icon: `image://${iconImageBaseUrl}others.jpg`, textStyle: { color: '#9D9D9D' } },
	{ name: 'Jinling', icon: `image://${iconImageBaseUrl}jinling.jpg`, textStyle: { color: '#314451' } },
	{ name: 'Main character', icon: `image://${iconImageBaseUrl}main_character.jpg`, textStyle: { color: '#D15A42' } },
	{ name: 'Jinling No.2', icon: `image://${iconImageBaseUrl}jinling_no2.jpg`, textStyle: { color: '#6C9AA0' } },
	{ name: 'Jinling No.3', icon: `image://${iconImageBaseUrl}jinling_no3.jpg`, textStyle: { color: '#769D74' } },
	{ name: 'Guan', icon: `image://${iconImageBaseUrl}guan.jpg`, textStyle: { color: '#7B9982' } },
	{ name: 'Event', icon: `image://${iconImageBaseUrl}event.jpg`, textStyle: { color: '#EBD389' } },
	{ name: 'Location', icon: `image://${iconImageBaseUrl}location.jpg`, textStyle: { color: '#D78A30' } }
];

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
	node.symbolSize = node.category === 'Event' || node.category === 'Location' ? 12 : node.value * 2.5;
	node.symbol = node.category !== 'Event' && node.category !== 'Location' && node.image && node.value >= 3 ? `image://${imageUrl}` : 'circle';
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
	color: ['#808080', '#314451', '#D15A42', '#6C9AA0', '#769D74', '#7B9982', '#baa76a', '#D78A30'],
	legend: {
		left: 20,
		top: 100,
		type: 'scroll',
		orient: 'vertical',
		itemWidth: 180,
		itemHeight: 35,
		itemGap: 30,
		data: categories,
		inactiveColor: 'none',
		formatter: function (name) {
			return '•';
		},
		textStyle: { fontSize: 35, padding: [3, 0, 0, 10] },
		selected: {
			Others: false,
			Jinling: true,
			'Main character': true,
			'Jinling No.2': false,
			'Jinling No.3': false,
			Guan: false,
			Event: false,
			Location: false
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
	if (nodeData.category === 'Event' && nodeData.image !== 'no image') {
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

bgAudio.play();
