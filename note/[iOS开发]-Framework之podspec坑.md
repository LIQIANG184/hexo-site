vendored_frameworks 找不到

错误示范
s.vendored_frameworks = ['../SDK/*.framework', '../SDK/dependency/*.framework']

正确示范
s.vendored_frameworks = ['SDK/*.framework', 'SDK/dependency/*.framework']

现象结论:
podspec没有权限访问上级目录
