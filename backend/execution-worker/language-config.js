const LANGUAGE_CONFIG = {
    py: {
        fileName: 'solution.py',
        compileCommand: null,
        runCommand: (file) => `python3 /app/${file} < input.txt`
    },

    js: {
        fileName: 'solution.js',
        compileCommand: null,
        runCommand: (file) => `node /app/${file} < input.txt`
    },

    c: {
        fileName: 'solution.c',
        compileCommand: (src, out) => `gcc ${src} -O2 --static -o ${out}`,
        runCommand: (file) => `/app/${file} < input.txt`
    },

    cpp: {
        fileName: 'solution.cpp',
        compileCommand: (src, out) => `g++ ${src} -O2 --static -o ${out}`,
        runCommand: (file) => `/app/${file} < input.txt`
    },

    java: {
        fileName: 'Main.java',
        compileCommand: (src, _) => `javac ${src}`,
        runCommand: (_) => `java -cp /app Main < input.txt`
    }
};

export default LANGUAGE_CONFIG;