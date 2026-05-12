(async () => {
	let cursor = [-1, -1];
	let click = false;
	let crossword = [];
	for (let y = 0; y < HEIGHT; y ++) {
		crossword.push([]);
		for (let x = 0; x < WIDTH; x ++) {
			crossword[y].push({"type":"letter","letter":" "});
		}
	}
	await new Promise (r => window.onload = r);
	let render = () => {
		let ca = document.getElementById("viewport");
		let c = ca.getContext("2d");
		c.clearRect(0, 0, ca.width, ca.height);
		let scale = {x : (ca.width / WIDTH), y : (ca.height / HEIGHT)};
		for (let y = 0; y < HEIGHT; y ++) {
			if (y != 0) {
				c.beginPath();
				c.moveTo(0, y * scale.y);
				c.lineTo(ca.width, y * scale.y);
				c.strokeStyle = "#000";
				c.lineWidth = 1;
				c.stroke();
				c.closePath();
			}
			for (let x = 0; x < WIDTH; x ++) {
				if (x != 0) {
					c.beginPath();
					c.moveTo(x * scale.x, 0);
					c.lineTo(x * scale.x, ca.height);
					c.strokeStyle = "#000";
					c.lineWidth = 1;
					c.stroke();
					c.closePath();
				}
				if (crossword[y][x].type == "fill") {
					c.beginPath();
					c.rect(x * scale.x, y * scale.y, scale.x, scale.y);
					c.fillStyle = "#000";
					c.fill();
					c.closePath();
				} else if (crossword[y][x].type == "letter") {
					c.beginPath();
					c.font = Math.min(scale.x, scale.y) * (0.8) + "px serif";
					c.fillStyle = "#000";
					c.textAlign = "center";
					c.fillText(crossword[y][x].letter, (x + 0.5) * scale.x, (y + 0.75) * scale.y);
					c.closePath();
				}
				if (crossword[y][x].number) {
					c.beginPath();
					c.font = Math.min(scale.x, scale.y) * (0.2) + "px serif";
					c.fillStyle = "#000";
					c.textAlign = "center";
					c.fillText(crossword[y][x].number, (x + 0.04 + (0.05 * crossword[y][x].number.toString().length)) * scale.x, (y + 0.2) * scale.y);
					c.closePath();
				}
			}
		}
		if (cursor[0] > -1 && cursor[0] < WIDTH && cursor[1] > -1 && cursor[1] < HEIGHT) {
			c.beginPath();
			c.rect(cursor[0] * scale.x, cursor[1] * scale.y, scale.x, scale.y);
			c.fillStyle = "#ff000022";
			c.fill();
			c.closePath();
		}
	};
	let annotate = () => {
		let isblank = (x, y) => {
			if (!(x > -1 && x < WIDTH && y > -1 && y < HEIGHT)) return true;
			return crossword[y][x].type != "letter";
		}
		let count = 0;
		for (let y = 0; y < HEIGHT; y ++) {
			for (let x = 0; x < WIDTH; x ++) {
				delete crossword[y][x].number;
				if (isblank(x - 1, y) || isblank(x, y - 1)) {
					crossword[y][x].number = ++ count;
				}
			}
		}
	}
	annotate();
	render();
	document.onmousedown = e => {
		let r = e.target.getBoundingClientRect();
		let h = e.target.height / HEIGHT;
		let w = e.target.width / WIDTH;
		let x = Math.floor((e.clientX - r.left) / w);
		let y = Math.floor((e.clientY - r.top) / h);
		if (x > -1 && x < WIDTH && y > -1 && y < HEIGHT) {
			cursor = [x, y];
			click = true;
			render();
		}
	}
	document.onmouseup = e => {
		let r = e.target.getBoundingClientRect();
		let h = e.target.height / HEIGHT;
		let w = e.target.width / WIDTH;
		let x = Math.floor((e.clientX - r.left) / w);
		let y = Math.floor((e.clientY - r.top) / h);
		if (x > -1 && x < WIDTH && y > -1 && y < HEIGHT) {
			cursor = [x, y];
			click = false;
		}
	}
	document.onkeydown = e => {
		if (document.activeElement.nodeName == "TEXTAREA") return true;
		if (([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).map(e => "" + e).includes(e.key)) {
			if (!(cursor[0] > -1 && cursor[0] < WIDTH && cursor[1] > -1 && cursor[1] < HEIGHT)) return true;
			if (!crossword[cursor[1]][cursor[0]].number) {
				crossword[cursor[1]][cursor[0]].number = 0;
			}
			crossword[cursor[1]][cursor[0]].number *= 10;
			crossword[cursor[1]][cursor[0]].number += parseInt(e.key);
			render();
		} else if (e.key.length == 1 && !e.altKey && !e.ctrlKey && !e.shiftKey) {
			if (!(cursor[0] > -1 && cursor[0] < WIDTH && cursor[1] > -1 && cursor[1] < HEIGHT)) return true;
			crossword[cursor[1]][cursor[0]].type = "letter";
			crossword[cursor[1]][cursor[0]].letter = e.key;
			render();
		}
		if (e.key == "Backspace") {
			if (!(cursor[0] > -1 && cursor[0] < WIDTH && cursor[1] > -1 && cursor[1] < HEIGHT)) return true;
			crossword[cursor[1]][cursor[0]].type = "letter";
			crossword[cursor[1]][cursor[0]].letter = " ";
			delete crossword[cursor[1]][cursor[0]].number;
			render();
		}
		if (e.key == " ") {
			if (!(cursor[0] > -1 && cursor[0] < WIDTH && cursor[1] > -1 && cursor[1] < HEIGHT)) return true;
			crossword[cursor[1]][cursor[0]].type = "fill";
			render();
			return false;
		}
		if (/Arrow(Up|Down|Left|Right)/g.test(e.key)) {
			if (e.key == "ArrowUp" && cursor[1] > 0) {
				-- cursor[1];
			} else if (e.key == "ArrowDown" && cursor[1] < HEIGHT - 1) {
				++ cursor[1];
			} else if (e.key == "ArrowLeft" && cursor[0] > 0) {
				-- cursor[0];
			} else if (e.key == "ArrowRight" && cursor[0] < WIDTH - 1) {
				++ cursor[0];
			}
			render();
			return false;
		}
	}
	document.getElementById("print").onclick = () => {
		cursor = [-1, -1];
		render();
		let a = document.createElement("p");
		a.classList.add("clue");
		a.innerText = document.getElementById("clues").value;
		let b = document.createElement("div");
		b.classList.add("p");
		let c = document.getElementById("viewport");
		document.body.innerHTML = "";
		document.body.appendChild(c);
		document.body.appendChild(b);
		document.body.appendChild(a);
	}
})();
