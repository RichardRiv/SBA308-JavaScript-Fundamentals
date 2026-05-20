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
	const courseId = course.id;
	const agCourseId = ag.course_id;

	if (courseId !== agCourseId) {
		throw new Error(
			'Assignment Group Course ID and Course Info ID do not match.',
		);
	}
};

const filterByPassedDueDate = (ag) => {
	let date = new Date();
	return ag.assignments.filter((obj) => date >= new Date(obj.due_at));
};

const groupDataByLid = (submissions, ag) => {
	const filteredAssignments = filterByPassedDueDate(ag);
	const rel = {};

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
	const assignmentsObject = {};

	for (let obj of filteredAssignments) {
		assignmentsObject[obj.id] = obj;
	}

	for (let key in assignmentsObject) {
		delete assignmentsObject[key].name;
	}

	return assignmentsObject;
};

const countDecimalPlaces = (grade) => {
	if (Math.floor(grade) === grade) return 0;
	return grade.toString().split('.')[1].length || 0;
};

const formatDecimalGrade = (grade) => {
	const decCount = countDecimalPlaces(grade);

	if (decCount === 0) {
		return Number(grade.toFixed(1));
	} else if (decCount > 3) {
		return Number(grade.toFixed(3));
	} else {
		return grade;
	}
};

const buildFinalResult = (filteredAssignments, filteredAssignmentsObj) => {
	const result = [];

	for (let learner in filteredAssignments) {
		let learnerObj = { id: Number(learner) };
		let average = 0;
		let pointsPossible = 0;

		for (let obj of filteredAssignments[learner]) {
			let assignment = filteredAssignmentsObj[obj.assignment_id];
			let assignmentPtsPossible = assignment.points_possible;
			let score = obj.submission.score;

			if (assignmentPtsPossible === 0) continue;
			try {
				if (typeof assignmentPtsPossible === 'string')
					throw new Error(
						`Points possible for assignment ID${assignment.id} is not of type Number: ${assignmentPtsPossible}`,
					);
				if (typeof score === 'string')
					throw new Error(
						`Score for LearnerID${learner} is not of type Number: ${score}`,
					);

				let isLate =
					new Date(obj.submission.submitted_at) > new Date(assignment.due_at);

				if (isLate) score -= assignmentPtsPossible * 0.1;

				let assignmentGrade = score / assignmentPtsPossible;
				assignmentGrade = formatDecimalGrade(assignmentGrade);
				learnerObj[assignment.id] = assignmentGrade;

				average += score;
				pointsPossible += assignmentPtsPossible;
			} catch (err) {
				console.log(err.message);
				continue;
			}
		}
		learnerObj['avg'] =
			pointsPossible > 0 ? formatDecimalGrade(average / pointsPossible) : 0;
		result.push(learnerObj);
	}

	return result;
};

function getLearnerData(course, ag, submissions) {
	try {
		isCourseIdMatched(course, ag);
	} catch (err) {
		console.log(err.message);
		return [];
	}

	const filteredAssignments = groupDataByLid(submissions, ag);
	const filteredAssignmentsObj = convertToObjects(AssignmentGroup);

	return buildFinalResult(filteredAssignments, filteredAssignmentsObj);
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
