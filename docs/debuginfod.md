# debuginfod support

:::tip

This page assumes familiarity with what debuginfos are. First read the [debuginfos](debuginfos) docs page if you are not already familiar with debuginfos.

:::

Unfortunately, packages distributed by various Linux distros [strip](https://man7.org/linux/man-pages/man1/strip.1.html) away debuginfos to minimize the size of the binaries.

Thankfully, there are publicly accessible servers, distributing debuginfos for various Linux package managers and distributions.

[debuginfod](https://www.mankier.com/8/debuginfod) is an HTTP file server that serves debuginfos to clients based on the Build IDs of the binaries. You can find out the Build ID of a binary using the `file` command on Linux.

Here is an example to find out the Build ID of a zsh binary:

```
$ file /bin/zsh

/bin/zsh: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=24fcd0179bb3aa797de6a570c2359e528f7638c0, for GNU/Linux 3.2.0, stripped
```

Parca integrates with debuginfod to query for upstream debuginfod files and then stores them for potential later use. The default debuginfod server used by Parca is: https://debuginfod.elfutils.org

To use a different set of debuginfod servers to attempt to retrieve debuginfos from use the `--debuginfod-upstream-servers` flag.

## Additional Resources

- debuginfod [web api](https://www.mankier.com/8/debuginfod#Webapi)
- debuginfod client/server [source code](https://sourceware.org/git/?p=elfutils.git;a=tree;f=debuginfod;h=066a691bde5a7a21a18173e5c5babfd1838fa6f5;hb=HEAD)
