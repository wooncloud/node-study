document.querySelectorAll("#user-list tr").forEach((el) => {
	el.addEventListener("click", () => {
		const id = el.querySelector("td").textContent;
		getComment(id);
	});
});

async function getUser() {
	try {
		const res = await axios.get("/users");
		const users = res.data;

		const tbody = document.querySelector("#user-list tbody");
		tbody.innerHTML = "";
		users.map(function (user) {
			const row = document.createElement("tr");
			row.addEventListener("click", () => {
				getComment(user.id);
			});

			row.innerHTML = `
				<td>${user.id}</td>
				<td>${user.name}</td>
				<td>${user.age}</td>
				<td>${user.married ? "기혼" : "미혼"}</td>
			`;

			tbody.appendChild(row);
		});
	} catch (err) {
		console.error(err);
	}
}

async function getComment(id) {
	try {
		const res = await axios.get(`/users/${id}/comments`);
		const comments = res.data;
		const tbody = document.querySelector("#comment-list tbody");
		tbody.innerHTML = "";
		comments.map(function (comment) {
			const row = document.createElement("tr");

			const edit = document.createElement("button");
			edit.textContent = "수정";
			edit.addEventListener("click", async () => {
				const newComment = prompt("바꿀 내용을 입력하세요.");
				if (!newComment) {
					return alert("내용을 반드시 입력하셔야 합니다.");
				}

				try {
					await axios.patch(`/comments/${comment.id}`, { comment: newComment });
					getComment(id);
				} catch (err) {
					console.error(err);
				}
			});

			const remove = document.createElement("button");
			remove.textContent = "삭제";
			remove.addEventListener("click", async () => {
				try {
					await axios.delete(`/comments/${comment.id}`);
					getComment(id);
				} catch (err) {
					console.error(err);
				}
			});

			row.innerHTML = `
				<td>${comment.id}</td>
				<td>${comment.User.name}</td>
				<td>${comment.comment}</td>
			`;
			const editTd = document.createElement("td");
			editTd.appendChild(edit);
			row.appendChild(editTd);

			const removeTd = document.createElement("td");
			removeTd.appendChild(remove);
			row.appendChild(removeTd);

			tbody.appendChild(row);
		});
	} catch (err) {
		console.error(err);
	}
}

document.getElementById("user-form").addEventListener("submit", async (e) => {
	e.preventDefault();
	const name = e.target.username.value;
	const age = e.target.age.value;
	const married = e.target.married.checked;

	if (!name || !age) {
		return alert("필수 항목을 입력하세요.");
	}

	try {
		await axios.post("/users", { name, age, married });
		getUser();
	} catch (err) {
		console.error(err);
	}
	e.target.username.value = "";
	e.target.age.value = "";
	e.target.married.checked = false;
});

document
	.getElementById("comment-form")
	.addEventListener("submit", async (e) => {
		e.preventDefault();
		const id = e.target.userid.value;
		const comment = e.target.comment.value;
		if (!id || !comment) {
			return alert("필수 항목을 입력하세요.");
		}
		try {
			await axios.post("/comments", { id, comment });
			getComment(id);
		} catch (err) {
			console.error(err);
		}

		e.target.userid.value = "";
		e.target.comment.value = "";
	});
