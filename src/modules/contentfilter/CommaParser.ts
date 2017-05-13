abstract class CommaParser {

    public static parse(data: string) : string[] {

        let ret = [];
        let temp = "";

        for (let i = 0; i < data.length; i++) {

            switch (data[i]) {


                case "\x5C":

                    if (data.length > (i + 1) ) {
                        i++;
                        temp += data[i];
                    }

                    break;

                case ",":

                    if (i < 2) {
                        if (data[i - 1] == "\\") {
                            temp += data[i];
                            continue;
                        }
                    }

                    if (temp != "") {
                        ret.push(temp);
                    }

                    temp = "";

                    break;

                default:
                    temp += data[i];

                    if (i == data.length - 1) {
                        if (temp != "") {
                            ret.push(temp);
                        }
                        break;
                    }

            }

        }


        return ret;

    }



}