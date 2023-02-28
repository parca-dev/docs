# Debuginfos

Profiling raw data is just memory addresses that represent a function call stack and how often we observed the same stack. For example a function call stack might look like this:

```
0x0b
0x2a
0x43
```

In order for humans to understand what these memory addresses represent, we need a mapping from memory address to function names. That mapping is what is commonly referred to as "debuginfos".

Debuginfos are in form of sections within an [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) binary (ELF is the format of binaries used on Linux). ELF binaries have sections, and some of these sections contain the debuginfos. Most commonly debuginfos are in the [DWARF format](https://dwarfstd.org/doc/DWARF5.pdf).

Let's look at example DWARF of a tiny C program.

```c
#include <stdio.h>
int main() {
   printf("Hello, World!");
   return 0;
}
```

Compile it, enabling DWARF to be emitted (`-g`):

```bash
zig cc -o mainc -g -target x86_64-linux main.c
```

> Note: Any C compiler could have been used here but Zig's cross-compile support is very convenient, as it works well on any platform.

And let's use the `dwarfdump` tool to print everything.

```dwarfdump
$ dwarfdump --show-form mainc
mainc:  file format elf64-x86-64

.debug_info contents:
0x00000000: Compile Unit: length = 0x00000047, format = DWARF32, version = 0x0004, abbr_offset = 0x0000, addr_size = 0x08 (next unit at 0x0000004b)

0x0000000b: DW_TAG_compile_unit
              DW_AT_producer [DW_FORM_strp]     ("Homebrew clang version 13.0.1")
              DW_AT_language [DW_FORM_data2]    (DW_LANG_C99)
              DW_AT_name [DW_FORM_strp] ("main.c")
              DW_AT_stmt_list [DW_FORM_sec_offset]      (0x00000000)
              DW_AT_comp_dir [DW_FORM_strp]     ("/Users/brancz/src/github.com/polarsignals/polarsignals/pkg/debuginfo/objfile/testdata")
              DW_AT_low_pc [DW_FORM_addr]       (0x0000000000201e20)
              DW_AT_high_pc [DW_FORM_data4]     (0x00000016)

0x0000002a:   DW_TAG_subprogram
                DW_AT_low_pc [DW_FORM_addr]     (0x0000000000201e20)
                DW_AT_high_pc [DW_FORM_data4]   (0x00000016)
                DW_AT_frame_base [DW_FORM_exprloc]      (DW_OP_reg6 RBP)
                DW_AT_GNU_all_call_sites [DW_FORM_flag_present] (true)
                DW_AT_name [DW_FORM_strp]       ("main")
                DW_AT_decl_file [DW_FORM_data1] ("/Users/brancz/src/github.com/polarsignals/polarsignals/pkg/debuginfo/objfile/testdata/main.c")
                DW_AT_decl_line [DW_FORM_data1] (2)
                DW_AT_type [DW_FORM_ref4]       (0x00000043 "int")
                DW_AT_external [DW_FORM_flag_present]   (true)

0x00000043:   DW_TAG_base_type
                DW_AT_name [DW_FORM_strp]       ("int")
                DW_AT_encoding [DW_FORM_data1]  (DW_ATE_signed)
                DW_AT_byte_size [DW_FORM_data1] (0x04)

0x0000004a:   NULL
```

Looking at this output, we see the compilation unit, which is the top level unit, and right underneath it a `DW_TAG_subprogram`, which is our `main` function. It has an attribute called `DW_AT_low_pc` with the form `DW_FORM_addr` (which means it is a `uint64`), that describes the start of our function's memory range, as well as the `DW_AT_high_pc` with the form `DW_FORM_data4` (which is a `int32`), which is the offset from the `DW_AT_low_pc` representing the end of our function's memory range, so the memory range is `[0x201e20, 0x201e36)`. And lastly, important for symbolization is the `DW_AT_name` attribute with the form `DW_FORM_strp`, which is a string.

Essentially what this means for symbolization: Thanks to this entry, we know that if we encountered a memory address between `0x201e20` and `0x201e36`, then it would be the `main` function.
