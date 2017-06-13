import axios from 'axios';

export const Store = {

	datas: {
		listFAQ: [],
		newFAQ: {
			answer: "",
			response: "",
			viewResponse: true
		}
	},

	loadDatas() {
		console.log('loadDatas running')
		axios.get('http://localhost:3000').then((res) => {
			this.datas.listFAQ = res.data;
		});
		console.log(this.datas.listFAQ)
	},

	addFAQ() {
		axios.post('http://localhost:3000/add', this.datas.newFAQ).then((res) => {
			this.datas.listFAQ = res.data;
			this.datas.newFAQ = {
				answer: "",
				response: "",
				viewResponse: true
			}
		});

	},
	remove(id) {
		axios.get(`http://localhost:3000/delete/${id}`).then((res) => {
			this.datas.listFAQ = res.data;
		})
	},
	changeViewResponse(id, visibility) {
		console.log(id)
		axios.post(`http://localhost:3000/answer/${id}&${visibility}`).then((res) => {
			this.datas.listFAQ = res.data;
		})
	}
}