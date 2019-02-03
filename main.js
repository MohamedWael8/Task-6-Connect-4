$(document).ready(
    function()
    {
        var model =
        {
            init : function()
            {
                this.board = [];
                this.boardSize = 42;
                this.player = 1;
                this.game = "in-session";
                this.build();
            },

            build : function()
            {
                for(let i=1; i<7; i++)
                {
                    for(let j=1; j<8; j++)
                    {
                        if(i==6)
                            this.board.push(new cell(i,j,"lightBlue","empty",true));
                        else
                            this.board.push(new cell(i,j,"white","empty",false));
                    }
                }
                console.log(this.board);//should be removed when the task is completed
            }
        }
        
        var view = 
        {
            init : function()
            {
                this.$rowDiv = $(".row");
                this.cellTemplate = $('script[data-template="cell"]').html();
                this.$rowDiv.on('click', '.circle', function(e) 
                {
                    var row = e.target.attributes.row.value;
                    var column = e.target.attributes.column.value
                    octopus.dropCell(row, column);
                    return false;
                });
                this.render();
            },

            render : function()
            {
                var $rowDiv = this.$rowDiv;
                $rowDiv.html('');
                cellTemplate = this.cellTemplate;
                var cells = octopus.getCells();
                cells.forEach(function(cell)
                {
                    var thisTemplate = cellTemplate.replace(/{{row}}/g, cell.row);
                    thisTemplate = thisTemplate.replace(/{{column}}/g, cell.column);
                    thisTemplate = thisTemplate.replace(/{{color}}/g, cell.color);
                    $rowDiv.append(thisTemplate);
                });
            }
        }

        var octopus =
        {
            init : function()
            {
                model.init();
                view.init();
            },

            dropCell : function(row,column)
            {
                if(model.game == "in-session")
                {
                    var currentCell =  model.board.find(cell => (cell.row == row && cell.column == column));
                    if(currentCell.status != "filled" && currentCell.available)
                    {
                        currentCell.status = "filled"
                        octopus.setAvailability(currentCell.id-1);
                        if(model.player == 1)
                        {
                            currentCell.color = "red";
                            this.connectFour(currentCell.id-1, currentCell.color)
                        }
                        else
                        {
                            currentCell.color = "yellow";
                            this.connectFour(currentCell.id-1, currentCell.color)
                        }
                        this.changePlayer();
                        view.render();
                    }
                }
                
                
            },

            getCells : function()
            {
                var cells = model.board;
                return cells;
            },

            changePlayer : function ()
            {
                if(model.player == 1)
                    model.player = 2;
                else
                    model.player = 1;
            },

            setAvailability : function (position)
            {
                model.board[position].available = false;
                if(position-7 > 0)
                {
                    model.board[position-7].available = true;
                    model.board[position-7].color = "lightBlue";
                }
            },

            connectFour : function (position,color)
            {
                var
                diagonalLeftTop =0, 
                diagonalTopRight = 0;
                if(this.horizontalConnection(position,color))
                {
                    console.log(color + " is the winner");
                    model.game = "ended";
                    return;
                }
                if(this.verticalConnection(position,color))
                {
                    console.log(color + " is the winner");
                    model.game = "ended";
                    return;
                }
                
            },

            horizontalConnection : function(position,color)
            {
                var horizontalCounter=0;
                var i=0;
                if(position+(i)<=model.boardSize-1) 
                {
                    console.log(model.board[position+(i)].row); // model[position+(i)].row position
                    if(model.board[position+(i)].row == model.board[position].row)
                    {
                        while(model.board[position+i].color == color)
                        {
                            horizontalCounter++;
                            i++;
                        }
                    }   
                }
               
                i=1;
                if(position-(i)>=0)
                {
                    if(model.board[position-(i)].row == model.board[position].row)
                    {
                        while(model.board[position-i].color == color)
                        {
                            horizontalCounter++;
                            i++;
                        }
                    }
                }
                if(horizontalCounter == 4)
                    return true;
                else
                    return false;
            },

            verticalConnection : function(position,color)
            {
                var verticalCounter=0;
                var i=0;
                if(position+(i*7) <= model.boardSize-1)
                {
                    if(model.board[position+(i*7)].column == model.board[position])
                    {
                        while(model.board[position+(i*7)].color == color)
                        {
                            verticalCounter++;
                            i++;
                        }
                    }
                }
                i=1;
                if(position-(i*7) >= 0)
                {
                    if(model.board[position-(i*7)].column == model.board[position].column)
                    {
                        while(model.board[position-(i*7)].color == color)
                        {
                            verticalCounter++;
                            i++;
                        }
                    }
                }
                if(verticalCounter == 4)
                    return true;
                else
                    return false;
            }


        }
        octopus.init();
    }
)

function cell(row,column,color,status,available)
{
    this.id = column+(7 * (row-1));
    this.row = row;
    this.column = column;
    this.color = color;
    this.status = status;
    this.available = available;
}