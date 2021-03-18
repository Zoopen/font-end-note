module.exports = {
    title: 'Zoopen\'s playground',
    description: 'Just playing around',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '学习', link: '/study/' },
            { text: '前端之路', link: '/font-end/' },
            {
                text: '更多',
                ariaLabel: 'More Menu',
                items: [
                    { text: 'todolist', link: '/More/todolist' }
                ]
            },
            { text: 'GitHub', link: 'https://github.com/zoopen', target: '_blank' }

        ],
        sidebar: {
            '/study/': [
                '',      /* /bar/ */
                'one', /* /bar/three.html */
                'two',   /* /bar/four.html */
                {
                    title: 'note',
                    children: [
                        {
                            title: 'TypeScript',
                            path: 'note/typescript'
                        },
                 
                    ]
                },
            ],
            '/font-end/': [
                {
                    title: 'font-end-basic',
                    children: [
                        {
                            title: 'xx',
                            path: 'font-end-basic/xx'
                        },
                        {
                            title: 'yy',
                            path: 'font-end-basic/yy'
                        },
                    ]
                },
                {
                    title: 'interview question',
                    children: [
                        {
                            title: 'Js',
                            path: 'interview-question/javascript'
                        },
                    ]
                }
            ],
            
        }

    }
}