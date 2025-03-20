using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Memory_game_backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedDifficulties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Difficulty",
                columns: new[] { "Id", "CreatedAt", "Name", "TimeLimit", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Easy", 1.0, new DateTime(2025, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, new DateTime(2025, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Medium", 0.5, new DateTime(2025, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, new DateTime(2025, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hard", 0.29999999999999999, new DateTime(2025, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Difficulty",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Difficulty",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Difficulty",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
