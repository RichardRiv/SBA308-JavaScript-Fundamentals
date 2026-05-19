// The provided course information.
const CourseInfo = {
	id: 451,
	name: 'Introduction to JavaScript',
};

// The provided assignment group.
const AssignmentGroup = {
	id: 12345,
	name: 'Fundamentals of JavaScript',
	course_id: 451,
	group_weight: 25,
	assignments: [
		{
			id: 1,
			name: 'Declare a Variable',
			due_at: '2023-01-25',
			points_possible: 50,
		},
		{
			id: 2,
			name: 'Write a Function',
			due_at: '2023-02-27',
			points_possible: 150,
		},
		{
			id: 3,
			name: 'Code the World',
			due_at: '3156-11-15',
			points_possible: 500,
		},
	],
};

// The provided learner submission data.
const LearnerSubmissions = [
	{
		learner_id: 125,
		assignment_id: 1,
		submission: {
			submitted_at: '2023-01-25',
			score: 47,
		},
	},
	{
		learner_id: 125,
		assignment_id: 2,
		submission: {
			submitted_at: '2023-02-12',
			score: 150,
		},
	},
	{
		learner_id: 125,
		assignment_id: 3,
		submission: {
			submitted_at: '2023-01-25',
			score: 400,
		},
	},
	{
		learner_id: 132,
		assignment_id: 1,
		submission: {
			submitted_at: '2023-01-24',
			score: 39,
		},
	},
	{
		learner_id: 132,
		assignment_id: 2,
		submission: {
			submitted_at: '2023-03-07',
			score: 140,
		},
	},
];

const isCourseIdMatched = (course, ag) => {
	let courseId = course.id;
	let agCourseId = ag.course_id;

	try {
		if (courseId === agCourseId) {
			return true;
		} else {
			return new Error(
				'Assignment Group Course ID and Course Info ID do not match.',
			);
		}
	} catch (err) {
		console.log(err);
	}
};

const filterByPassedDueDate = (ag) => {
	let date = new Date();
	return ag.assignments.filter((obj) => date >= new Date(obj.due_at));
};

const groupDataByLid = (submissions, ag) => {
	let filteredAssignments = filterByPassedDueDate(ag);
	let rel = {};

	for (let sub of submissions) {
		let lid = sub.learner_id;
		if (!rel[lid]) rel[lid] = [];

		for (let fa of filteredAssignments) {
			if (sub.assignment_id === fa.id) rel[lid].push(sub);
		}
	}

	return rel;
};

const convertToObjects = (ag) => {
	const filteredAssignments = filterByPassedDueDate(ag);
	let assignmentsObject = {};

	for (let obj of filteredAssignments) {
		assignmentsObject[obj.id] = obj;
	}

	return assignmentsObject;
};

const countDecimalPlaces = (grade) => {
	if (Math.floor(grade) === grade) return 0;
	return grade.toString().split('.')[1].length || 0;
};

function getLearnerData(course, ag, submissions) {
	const isForSameCourse = isCourseIdMatched(course, ag);

	if (isForSameCourse) {
		const filteredAssignments = groupDataByLid(submissions, ag);
		const filteredAssignmentsObj = convertToObjects(AssignmentGroup);

		let result = [];
		for (let learner in filteredAssignments) {
			let learnerObj = { id: Number(learner) };
			let average = 0;
			let pointsPossible = 0;

			for (let obj of filteredAssignments[learner]) {
				let assignment = filteredAssignmentsObj[obj.assignment_id];
				let score = obj.submission.score;
				let isLate =
					new Date(obj.submission.submitted_at) > new Date(assignment.due_at);

				if (isLate) score -= assignment.points_possible * 0.1;

				let assignmentGrade = score / assignment.points_possible;
				if (countDecimalPlaces(assignmentGrade) > 3)
					assignmentGrade = Number(assignmentGrade.toFixed(3));
				learnerObj[assignment.id] = assignmentGrade;

				average += score;
				pointsPossible += assignment.points_possible;
			}
			learnerObj['avg'] = average / pointsPossible;
			result.push(learnerObj);
		}

		console.log(result);

		/**
		 * obj = {
		 *   id: learner_id,
		 *   avg: (submission.score + submission.score) / (ag.a.pts_possible + ag.a.pts_possible)
		 *   ag.a.id: submission.score / ag.a.pts_possible
		 *   ag.a.id: submission.score / ag.a.pts_possible
		 *   ag.a.id: (submission.score - 10%) / ag.a.pts_possible IF LATE
		 * }
		 */
	}
	// // here, we would process this data to achieve the desired result.
	// const result = [
	// 	{
	// 		id: 125,
	// 		avg: 0.985, // (47 + 150) / (50 + 150)
	// 		1: 0.94, // 47 / 50
	// 		2: 1.0, // 150 / 150
	// 	},
	// 	{
	// 		id: 132,
	// 		avg: 0.82, // (39 + 125) / (50 + 150)
	// 		1: 0.78, // 39 / 50
	// 		2: 0.833, // late: (140 - 15) / 150
	// 	},
	// ];
	// return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
