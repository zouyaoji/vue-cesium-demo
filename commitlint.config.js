/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
//git commit -m"特性11(asdddd): asda "
/**
 *
 * @param {*} context
 * @returns
 */
function getPackages(context) {
  return Promise.resolve()
    .then(() => {
      const srcDir = path.resolve(__dirname, './src')
      const srcDirs = fs.readdirSync(srcDir).filter(dir => !dir.includes('.'))
      const pagesDir = path.resolve(__dirname, './src/pages')
      const pageDirs = fs.readdirSync(pagesDir).filter(dir => !dir.includes('.'))
      return Promise.resolve([...srcDirs, ...pageDirs])
    })
    .then(a => {
      return a
    })
}

const scopes = ['project', 'core', 'style', 'docs', 'ci', 'dev', 'build', 'deploy', 'other']
// const scopes = ['项目', '核心', '风格', '文档', '集成', '构建', '发布', '其他']
module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    // eslint-disable-next-line no-useless-escape
    parserOpts: { headerPattern: /^([^\(\):]*)(?:\((.*)\))?!?: (.*)$/ }
  },
  rules: {
    // 'scope-enum': ctx => getPackages(ctx).then(packages => [1, 'always', [...packages, ...scopes]]),
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [1, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build', // 构建
        'ci', // ci
        'chore', // 改变构建流程、或者增加依赖库、工具等
        'docs', // 仅仅修改了文档，比如README, CHANGELOG, CONTRIBUTE等等
        'feat', // 新增feature
        'fix', // 修复bug
        'perf', // 优化相关，比如提升性能、体验
        'refactor', // 代码重构，没有加新功能或者修复bug
        'revert', // 回滚到上一个版本
        'style', //  仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
        'test' // 测试用例，包括单元测试、集成测试等
        // '构建', // 构建
        // '集成', // ci
        // '架构', // 改变构建流程、或者增加依赖库、工具等
        // '文档', // 仅仅修改了文档，比如README, CHANGELOG, CONTRIBUTE等等
        // '特性', // 新增feature
        // '修复', // 修复bug
        // '性能', // 优化相关，比如提升性能、体验
        // '重构', // 代码重构，没有加新功能或者修复bug
        // '回滚', // 回滚到上一个版本
        // '风格', //  仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
        // '测试' // 测试用例，包括单元测试、集成测试等
      ]
    ]
  },
  prompt: {
    questions: {
      type: {
        // description: "Select the type of change that you're committing",
        description: '选择一种你的提交类型',
        enum: {
          // feat: {
          //   description: 'A new feature',
          //   title: 'Features',
          //   emoji: '✨'
          // },
          feat: {
            description: '一个新的特性',
            title: 'Features',
            emoji: '✨'
          },
          // fix: {
          //   description: 'A bug fix',
          //   title: 'Bug Fixes',
          //   emoji: '🐛'
          // },
          fix: {
            description: '修复一个Bug',
            title: 'Bug Fixes',
            emoji: '🐛'
          },
          // docs: {
          //   description: 'Documentation only changes',
          //   title: 'Documentation',
          //   emoji: '📚'
          // },
          docs: {
            description: '仅更改了文档',
            title: 'Documentation',
            emoji: '📚'
          },
          // style: {
          //   description:
          //     'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
          //   title: 'Styles',
          //   emoji: '💎'
          // },
          style: {
            description: '不改变代码逻辑的更改（空格、格式、缺少分号等）',
            title: 'Styles',
            emoji: '💎'
          },
          // refactor: {
          //   description: 'A code change that neither fixes a bug nor adds a feature',
          //   title: 'Code Refactoring',
          //   emoji: '📦'
          // },
          refactor: {
            description: '代码重构，没有加新功能或者修复Bug',
            title: 'Code Refactoring',
            emoji: '📦'
          },
          // perf: {
          //   description: 'A code change that improves performance',
          //   title: 'Performance Improvements',
          //   emoji: '🚀'
          // },
          perf: {
            description: '优化性能的更改',
            title: 'Performance Improvements',
            emoji: '🚀'
          },
          // test: {
          //   description: 'Adding missing tests or correcting existing tests',
          //   title: 'Tests',
          //   emoji: '🚨'
          // },
          test: {
            description: '添加缺失的测试或者纠正现有的测试',
            title: 'Tests',
            emoji: '🚨'
          },
          // build: {
          //   description:
          //     'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
          //   title: 'Builds',
          //   emoji: '🛠'
          // },
          build: {
            description: '影响构建系统或外部依赖项的更改（示例范围：gulp、broccoli、npm）',
            title: 'Builds',
            emoji: '🛠'
          },
          // ci: {
          //   description:
          //     'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
          //   title: 'Continuous Integrations',
          //   emoji: '⚙️'
          // },
          ci: {
            description: '对 CI 配置文件和脚本的更改（示例范围：Travis、Circle、BrowserStack、SauceLabs)',
            title: 'Continuous Integrations',
            emoji: '⚙️'
          },
          // chore: {
          //   description: "Other changes that don't modify src or test files",
          //   title: 'Chores',
          //   emoji: '♻️'
          // },
          chore: {
            description: '不修改 src 或测试文件的其他更改',
            title: 'Chores',
            emoji: '♻️'
          },
          // revert: {
          //   description: 'Reverts a previous commit',
          //   title: 'Reverts',
          //   emoji: '🗑'
          // },
          revert: {
            description: '回滚到上一个版本',
            title: 'Reverts',
            emoji: '🗑'
          }
        }
      },
      scope: {
        // description: 'What is the scope of this change (e.g. component or file name)'
        description: '此更改的范围是什么（例如组件或文件名）'
      },
      subject: {
        // description: 'Write a short, imperative tense description of the change'
        description: '写一个简短的、命令式的变化描述'
      },
      body: {
        // description: 'Provide a longer description of the change'
        description: '提供更详细的更改描述'
      },
      isBreaking: {
        // description: 'Are there any breaking changes?'
        description: '包含破坏性更改吗？'
      },
      breakingBody: {
        // description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself'
        description: '一个破坏性更改需要提交一个正文。请输入一个更长更详细的描述'
      },
      breaking: {
        // description: 'Describe the breaking changes'
        description: '描述破坏性更改'
      },
      isIssueAffected: {
        // description: 'Does this change affect any open issues?'
        description: '本次更改是否影响某个打开的 issues ？'
      },
      issuesBody: {
        // description:
        //   'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself'
        description: '如果需要关闭了一些 issues，则需要提交一个正文。请输入一个更长更详细的描述'
      },
      issues: {
        // description: 'Add issue references (e.g. "fix #123", "re #123".)'
        description: '添加问题参考（例如“修复 #123”、“重开 #123”。）'
      }
    }
  }
}
