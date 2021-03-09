#Homework 1

## Task 1

**A program which reads a string from the standard input stdin, reverses it and then writes it to the standard output stdout.**

To run the script just enter `npm run hw1t1` to your console.

## Task 2

**A program which takes a .csv file from "/csv" directory, converts it to json and writes the result to .txt file.**

To run the script enter `npm run hw1t2` to your console.

There are two arguments of the script:

| Name | Description | Default value |
| --- | --- | --- |
| fileName | String with name of the file to convert | "nodejs-hw1-ex1" |
| dirName | Path to the directory "/csv" from the current directory | "./src/homework1/csv/" |

Just enter one or two of these arguments to the end of your script:

```shell
npm run hw1t2 -- --dirName="src/homework1/csv/" --fileName="file1"
```
