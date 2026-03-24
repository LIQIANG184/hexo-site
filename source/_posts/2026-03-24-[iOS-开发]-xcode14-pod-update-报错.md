---
title: "[iOS-开发]-xcode14-pod-update-报错"
date: 2026-03-24 14:48:30
tags:
  - 笔记
categories:
  - "知识分享"
from_note: true
source_note: "知识分享/[iOS-开发]-xcode14-pod-update-报错.md"
---

#xcode14   pod update 的时候报错:

 ([Xcodeproj] Unknown object version (56). (RuntimeError))
 

    Analyzing dependencies
    /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/user_interface/error_report.rb:34:in `force_encoding': can't modify frozen String (FrozenError)
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/user_interface/error_report.rb:34:in `report'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/command.rb:66:in `report_error'
	from /Library/Ruby/Gems/2.6.0/gems/claide-1.0.3/lib/claide/command.rb:396:in `handle_exception'
	from /Library/Ruby/Gems/2.6.0/gems/claide-1.0.3/lib/claide/command.rb:337:in `rescue in run'
	from /Library/Ruby/Gems/2.6.0/gems/claide-1.0.3/lib/claide/command.rb:324:in `run'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/command.rb:52:in `run'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/bin/pod:55:in `<top (required)>'
	from /usr/local/bin/pod:23:in `load'
	from /usr/local/bin/pod:23:in `<main>'
    /Library/Ruby/Gems/2.6.0/gems/xcodeproj-1.21.0/lib/xcodeproj/project.rb:228:in `initialize_from_file': [Xcodeproj] Unknown object version (56). (RuntimeError)
	from /Library/Ruby/Gems/2.6.0/gems/xcodeproj-1.21.0/lib/xcodeproj/project.rb:113:in `open'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer/analyzer.rb:1190:in `block (2 levels) in inspect_targets_to_integrate'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer/analyzer.rb:1189:in `each'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer/analyzer.rb:1189:in `block in inspect_targets_to_integrate'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/user_interface.rb:64:in `section'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer/analyzer.rb:1184:in `inspect_targets_to_integrate'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer/analyzer.rb:106:in `analyze'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer.rb:416:in `analyze'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer.rb:241:in `block in resolve_dependencies'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/user_interface.rb:64:in `section'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer.rb:240:in `resolve_dependencies'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/installer.rb:161:in `install!'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/command/install.rb:52:in `run'
	from /Library/Ruby/Gems/2.6.0/gems/claide-1.0.3/lib/claide/command.rb:334:in `run'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/lib/cocoapods/command.rb:52:in `run'
	from /Library/Ruby/Gems/2.6.0/gems/cocoapods-1.11.3/bin/pod:55:in `<top (required)>'
	from /usr/local/bin/pod:23:in `load'
	from /usr/local/bin/pod:23:in `<main>'
这个问题一般是发生在Xcode升级后,新建的项目pod install, 然后 pod update
<!-- more -->
#解决方法
把Project Format改到低版本然后pod update


![image.png](/images/note/18ea1c69661801554692e14afc414139.webp)

