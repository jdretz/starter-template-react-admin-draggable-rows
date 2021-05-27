import { rest } from 'msw';

if (!localStorage.getItem('forms')) {
    localStorage.setItem('forms', JSON.stringify([
        {
            id: 1,
            title: "Basic Info",
            questions: [
                {
                    id: 1,
                    text: 'What is your name?'
                },
                {
                    id: 2,
                    text: 'Where are you from?'
                },
                {
                    id: 3,
                    text: 'What is your occupation?'
                }
            ]
        },
        {
            id: 2,
            title: "Favorites",
            questions: [
                {
                    id: 1,
                    text:'Whats your favorite color?'
                },
                {
                    id: 2,
                    text:'What is your favorite book?'
                },
                {
                    id: 3,
                    text:'What is your favorite movie?'
                }
            ]
        }
    ]))
}

const getForms = () => {
    let forms = localStorage.getItem('forms');
    return JSON.parse(forms)
}

export const handlers = [
    rest.get('/forms', (req, res, ctx) => {
        let forms = getForms()
        return res(
            ctx.status(200),
            ctx.set('content-range', forms.length),
            ctx.json(forms)
        )
    }),
    rest.get('/forms/:id', async (req, res, ctx) => {
        let forms = getForms()
        let { id } = req.params;

        const match = await forms.find(ques => ques.id == id)

        return res(
            ctx.status(200),
            ctx.json(match)
        )
    }),
    rest.post('/forms', (req, res, ctx) => {
        let forms = getForms();
        const newForm = req.body;
        const newFormArray = [...forms, newForm];

        localStorage.setItem('forms', JSON.stringify(newFormArray));
        return res(
            ctx.status(201),
            ctx.json(newForm)
        )
    }),
    rest.put('/forms/:id', async (req, res, ctx) => {
        let forms = getForms();
        const { id } = req.params;
        const updatedForm = req.body;
        const index = await forms.findIndex(form => form.id === Number(id))
        const oldForm = forms[index];

        const newForm = {...oldForm, ...updatedForm}
        forms.splice(index, 1, newForm);
        localStorage.setItem('forms', JSON.stringify(forms));

        return res(
            ctx.status(202),
            ctx.json(newForm)
        )
    }),
    rest.delete('/forms/:id', async (req, res, ctx) => {
        let forms = getForms();
        const { id } = req.params;
        const newFormArray = await forms.filter(ques => ques.id != id);

        localStorage.setItem('forms', JSON.stringify(newFormArray));

        return res(
            ctx.status(202),
            ctx.json({
                id
            })
        )
    })
]