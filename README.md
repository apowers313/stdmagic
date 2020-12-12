An expanded subset of [Jupyter](https://jupyter.org/) [magics](https://ipython.readthedocs.io/en/stable/interactive/magics.html#line-magics) for the [IJavascript kernel](https://github.com/n-riesco/ijavascript).

# Installation
> npm install stdmagic

Then in Jupyter running a IJavascript kernel:
``` js
// if '$$.addMagic' is detected in the IJavascript kernel, it is automatically called to add the magics
require("stdmagic");
```

# User Guide
Use `%lsmagic` to get a list of available magics.

Use `?%magicname` or `%magicname?` to get help for that magic. (Coming soon)

# Contributing
Any ideas for magics that improve productivity or enjoyment of Jupyter are welcome as contributions. Pull requests are preferred to issues.