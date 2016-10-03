{
    "variables": {
        "project_root": "/home/mgilg/projects/git/processapi",
        "postgres_root": "<@(project_root)/cpp/postgres",
        "include_root": "<@(postgres_root)/inc",
        "lib_linux_root": "<@(postgres_root)/lib/linux",
        "lib_win_root": "<@(postgres_root)/lib/win"
    },
    "targets": [
        {
            "target_name": "pgaccess",
            "include_dirs": [
                "<@(include_root)",
                "<!(node -e \"require('nan')\")"
            ],
            "link_settings": {
                "libraries": [
                    "<@(lib_linux_root)/libpqxx.so"
                ],
                "ldflags": [
                    "-L<@(lib_linux_root)",
                    "-Wl,-rpath,<@(lib_linux_root)"
                ]
            },
            "cflags": [
                "-std=c++11"
            ],
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [
                "access.cc"
            ]
        }
    ],
    "conditions": [
        ['OS=="win"', {
            "targets": [
                {
                    "target_name": "pgaccess",
                    "include_dirs": [
                        "<@(include_root)",
                        "<!(node -e \"require('nan')\")"
                    ],
                    "link_settings": {
                        "libraries": [
                            "-llibpqxx"
                        ],
                        "ldflags": [
                            "-L<@(lib_win_root)",
                            "-Wl,-rpath,<@(lib_win_root)"
                        ]
                    },
                    "cflags": [
                        "-std=c++11"
                    ],
                    "sources": [
                        "access.cc"
                    ]
                }
            ]
        }]
    ]

}
