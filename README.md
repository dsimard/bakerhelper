# bakerhelper - Helper for Cakefile

I created this project because I found myself reusing the same 
[Cakefile](http://coffeescript.org/#cake) over and over again. I copied it
and then I made small changes to it. Eventually, I lost track of the "good" one 
(the most recent) so I decided to package them in a helper.

__WARNING!__ Those are not cake `tasks`, it means you can't write
`cake compileCoffeescripts` and it will magically work. You have to write your
own tasks but _bakerhelper_ will help you doing it.

## API reference

### exec(cmd, options, callback)

Overrides `child_process.r.exec` to log to console and exit if there's an error

    bakerhelper.exec 'rm *.js', {cwd:'./lib'}, (err, stdout, stderr)->

`options` : See (`child_process`)[http://nodejs.org/api/child_process.html#child_process_child_process_r.exec_command_options_callback] documentation

The callback is passed three arguments (`err`, `stdout`, `stderr`)

### compileCoffeescripts(directory, option={})

Compile all the coffeescripts into javascript files from a directory (not recursive)

    bakerhelper.compileCoffeescripts './lib/'
    bakerhelper.compileCoffeescripts './bin/', {shebang:true}

`options.shebang` : If it should add a shebang at the top of the file
  
### generateDoccoHusky(directories=[])

Generate doc with [docco-husky](https://github.com/mbrevoort/docco-husky)
and push it to the `gh-pages` branch.

    bakerhelper.compileCoffeescripts ['./lib/', './bin']
