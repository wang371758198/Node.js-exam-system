//处理考题相关的数据库操作
const model = require('../import-middleware')();
const exam = model.exam;
const answer = model.answer;
const scope = model.scope;

//添加考题
function add_exam(title, content, options, type, scope){
    var answers = [];
    for(let i = 0; i < options.length; i++){
        let obj = {
            option : options[i]
        }
        answers.push(obj);
    }
    exam.create({
        title,
        content,
        type,
        scope_id : scope,
        answers
    }, {
        include : [answer]
    })
}

//获取所有考题
async function get_exams(offset, limit){
    var exams = [];
    await exam.findAndCountAll({
        limit,
        offset,
        include : {
            model : scope
        }
    }).then((result)=>{
        exams = JSON.stringify(result);
    })
    return exams;
}
//根据id获取指定考题
async function get_exam(id){
    var data = null;
    await exam.findById(id, {
        include : [
            {
                model : scope
            },
            {
                model : answer
            }
        ]
    }).then((result)=>{
        data = JSON.stringify(result);
    })
    return data;
}

//修改指定考题
async function update_exam(id, title, content, options, type, chooseScope){
    await exam.findById(id, {
        include : [
            {
                model : scope
            },
            {
                model : answer
            }
        ]
    }).then((result)=>{
        console.log(JSON.stringify(result));
        result.title = title;
        result.content = content;
        answers = [];
        result.setAnswers([]);
        for(let i = 0; i < options.length; i++){
            var newAnswer = answer.create({option : options[i], exam_id : id});
            result.addAnswers(answers);
        }
        result.type = type;
        result.scope_id = chooseScope;
        result.save();
    })
}

module.exports = {
    add_exam,
    get_exams,
    get_exam,
    update_exam
}