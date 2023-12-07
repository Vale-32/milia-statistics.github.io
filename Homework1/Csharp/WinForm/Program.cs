using System;
using System.Drawing;
using System.Windows.Forms;

public class DrawingForm : Form
{
    public DrawingForm()
    {
        // Define title of the window
        this.Text = "Forms Drawing";

        // generate Paint module
        this.Paint += new PaintEventHandler(OnPaint);
    }

    private void OnPaint(object sender, PaintEventArgs e)
    {
        // create a graphic object from paint graphics evenment
        Graphics g = e.Graphics;

        // create pen object in order to draw
        Pen pen = new Pen(Color.Black);

        // draw circle
        g.DrawEllipse(pen, 50, 50, 100, 100);

        // draw point
        g.DrawRectangle(pen, 200, 50, 1, 1);

        // draw line
        g.DrawLine(pen, 50, 200, 150, 200);

        // draw rectangle
        g.DrawRectangle(pen, 200, 200, 100, 50);
    }

    public static void Main()
    {
        Application.Run(new DrawingForm());
    }
}