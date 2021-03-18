module.exports = {
    title: 'Hello VuePress',
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
                'two'   /* /bar/four.html */
            ],
        
            '/font-end/': [
                {
                    title: '前端基础',
                    children: [
                        {
                            title: 'xx',
                            path: 'font-end-basic/xx',
                            collapsable: false
                        },
                        {
                            title: 'yy',
                            path: 'font-end-basic/yy',
                            collapsable: false
                        }
                    ]
                },
                {
                    title: 'Group2',
                }

            ],

        }

    }
}