public class Abc{
 public List<string> orders = new List<string>(); // public field (bad)

 public async Task ProcessOrders(List<string> inputOrders)
 {
 Console.WriteLine("Starting processing...");

 orders = inputOrders; // no null check

 for (int i = 0; i < orders.Count; i++)
 {
 var order = orders[i];

 if (order != null && order != "")
 {
 Console.WriteLine("Processing order: " + order);

 if (order.Contains("EXP"))
 {
 ApplyDiscount(order);
 }
 else
 {
 ApplyDiscount(order); // duplicate logic
 }

 try
 {
 SaveOrder(order).Wait(); // blocking async call
 }
 catch (Exception ex)
 {
 Console.WriteLine(ex.Message); // poor logging
 }
 }
 else
 {
 Console.WriteLine("Invalid order");
 }
 }

 Console.WriteLine("Done");
 }

 private async Task SaveOrder(string order)
 {
 await Task.Delay(100); // simulate DB call

 if (order.Length < 3)
 {
 throw new Exception("Order too short"); // generic exception
 }

 Console.WriteLine("Saved: " + order);
 }

 private void ApplyDiscount(string order)
 {
 var discount = 0;

 if (order.StartsWith("VIP"))
 {
 discount = 10;
 }
 else if (order.StartsWith("VIP")) // duplicate condition
 {
 discount = 20;
 }

 Console.WriteLine("Discount applied: " + discount);
 }

 public int CalculateTotal(List<int> values)
 {
 int total = 0;

 for (int i = 0; i < values.Count; i++)
 {
 total = total + values[i];
 }

 return total;
 }

 public void ProcessData()
 {
 var dt = new DataTable();
 dt.Columns.Add("Name");

 dt.Rows.Add("Test");

 foreach (DataRow row in dt.Rows)
 {
 Console.WriteLine(row["Name"]);
 }
 }
 }


}
