<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    // Define the relationship with Order model
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Define the relationship with Product model
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
