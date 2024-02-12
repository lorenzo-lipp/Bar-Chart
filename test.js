function it(msg, fn) { console.assert(fn(), msg); }

window.addEventListener("load", async () => {
    await sleep(500);

    it("should have a title with a corresponding id=\"title\"", () => {
        return document.querySelector("#title") !== undefined;
    });

    it("should have a g element x-axis with a corresponding id=\"x-axis\"", () => {
        let xAxis = document.querySelector("#x-axis");

        return xAxis !== undefined &&
               xAxis.tagName === "g";
    })

    it("should have a g element y-axis with a corresponding id=\"y-axis\"", () => {
        let yAxis = document.querySelector("#y-axis");

        return yAxis !== undefined &&
               yAxis.tagName === "g";
    });

    it("should contain multiple tick labels in both axis, each with a corresponding class=\"tick\"", () => {
        let xAxis = document.querySelector("#x-axis");
        let yAxis = document.querySelector("#y-axis");
        let xTicks = 0;
        let yTicks = 0;

        for (let child of xAxis.children) {
            if (child.tagName === "g") xTicks++;
        }

        for (let child of yAxis.children) {
            if (child.tagName === "g") yTicks++;
        }

        return xTicks > 1 && yTicks > 1;
    });

    it("should have a rect element for each data point with a corresponding class=\"bar\" displaying the data.", () => {
        let rects = document.querySelectorAll("rect.bar");

        return rects.length === globalData.data.length;
    });

    it("should have the properties data-date and data-gdp containing date and GDP values for each .bar.", () => {
        let rects = document.querySelectorAll("rect.bar");

        for (let i = 0; i < rects.length; i++) {
            if (typeof rects[i].dataset.date !== "string" &&
                typeof rects[i].dataset.gdp !== "number"
            ) return false;
        }

        return true;
    });

    it("the .bar elements' data-date properties should match the order of the provided data.", () => {
        let rects = document.querySelectorAll("rect.bar");

        for (let i = 0; i < rects.length; i++) {
            if (rects[i].dataset.date !== globalData.data[i][0]) return false;
        }

        return true;
    });

    it("the .bar elements' data-gdp properties should match the order of the provided data.", () => {
        let rects = document.querySelectorAll("rect.bar");

        for (let i = 0; i < rects.length; i++) {
            if (rects[i].dataset.gdp != globalData.data[i][1]) return false;
        }

        return true;
    });

    it("each .bar element's height should accurately represent the data's corresponding GDP.", () => {
        let rects = document.querySelectorAll("rect.bar");

        for (let i = 0; i < rects.length; i++) {
            let heightRatio = rects[rects.length - 1].getAttribute("height") / rects[i].getAttribute("height");
            let gdpRatio = globalData.data[rects.length - 1][1] / globalData.data[i][1];

            if (Math.abs(heightRatio - gdpRatio) > 0.001) return false;
        }

        return true;
    });

    it("the data-date attribute and its corresponding .bar element should align with the corresponding value on the x-axis.", () => {
        let rects = document.querySelectorAll("rect.bar");

        for (let i = 0; i < rects.length - 1; i++) {
            if (rects[i].dataset.date < rects[i + 1].dataset.date &&
                +rects[i].getAttribute("x") >= +rects[i + 1].getAttribute("x")
            ) return false;

            if (rects[i].dataset.date > rects[i + 1].dataset.date &&
                +rects[i].getAttribute("x") <= +rects[i + 1].getAttribute("x")
            ) return false;

            if (rects[i].dataset.date === rects[i + 1].dataset.date &&
                +rects[i].getAttribute("x") !== +rects[i + 1].getAttribute("x")
            ) return false;
        }

        return true;
    });

    it("the data-gdp attribute and its corresponding .bar element should align with the corresponding value on the y-axis.", () => {
        let rects = document.querySelectorAll("rect.bar");

        for (let i = 0; i < rects.length - 1; i++) {
            if (+rects[i].dataset.gdp < +rects[i + 1].dataset.gdp &&
                +rects[i].getAttribute("y") <= +rects[i + 1].getAttribute("y")
            ) return false;

            if (+rects[i].dataset.gdp > +rects[i + 1].dataset.gdp &&
                +rects[i].getAttribute("y") >= +rects[i + 1].getAttribute("y")
            ) return false;

            if (+rects[i].dataset.gdp === +rects[i + 1].dataset.gdp &&
                +rects[i].getAttribute("y") !== +rects[i + 1].getAttribute("y")
            ) return false;
        }

        return true;
    });

    it("I can mouse over an area and see a tooltip with a corresponding id=\"tooltip\" which displays more information about the area.", () => {
        let rect = document.querySelector("rect.bar");
        let mOver = new MouseEvent("mouseover");

        mOver.fromTarget = rect;
        rect.dispatchEvent(mOver);

        let tooltip = document.querySelector("#tooltip");

        if (!tooltip || tooltip.style.display === "none") return false;

        return true;
    });

    it("the tooltip should have a data-date property that corresponds to the data-date of the active area.", () => {
        let rect = document.querySelector("rect.bar");
        let mMove = new MouseEvent("mousemove");

        mMove.fromTarget = rect;
        rect.dispatchEvent(mMove);

        let tooltip = document.querySelector("#tooltip");

        if (!tooltip || tooltip.dataset.date !== rect.dataset.date) return false;

        return true;
    });

    let rect = document.querySelector("rect.bar");
    let mLeave = new MouseEvent("mouseleave");

    mLeave.fromTarget = rect;
    rect.dispatchEvent(mLeave);
});

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }